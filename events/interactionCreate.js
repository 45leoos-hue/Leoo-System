const { Events } = require('discord.js');
const config = require('../config.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {
        try {

            // ======================
            // 🔹 SLASH COMMANDS
            // ======================
            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                const teamCommands = ['teamkick', 'uprank', 'derank', 'teamjoin'];

                if (teamCommands.includes(interaction.commandName)) {

                    const member = await interaction.guild.members.fetch(interaction.user.id);

                    if (!config.teamAllowedRoleId) {
                        return interaction.reply({
                            content: "❌ Keine teamAllowedRoleId in config!",
                            ephemeral: true
                        });
                    }

                    if (!member.roles.cache.has(config.teamAllowedRoleId)) {
                        return interaction.reply({
                            content: "❌ Du hast keine Berechtigung dafür!",
                            ephemeral: true
                        });
                    }
                }

                return await command.execute(interaction, client, config);
            }

            // ======================
            // 🔘 BUTTONS (CACHED)
            // ======================
            if (interaction.isButton()) {

                if (!client.buttonCache) {
                    client.buttonCache = new Map();

                    const buttonsPath = path.join(__dirname, '../buttons');
                    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

                    for (const file of buttonFiles) {
                        const button = require(`../buttons/${file}`);
                        if (button.id) {
                            client.buttonCache.set(button.id, button);
                        }
                    }
                }

                const button = client.buttonCache.get(interaction.customId);
                if (!button) return;

                return await button.execute(interaction, client, config);
            }

            // ======================
            // 📜 SELECT MENUS (CACHED)
            // ======================
            if (interaction.isStringSelectMenu()) {

                if (!client.selectMenuCache) {
                    client.selectMenuCache = new Map();

                    const selectMenusPath = path.join(__dirname, '../selectMenus');
                    const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

                    for (const file of selectMenuFiles) {
                        const menu = require(`../selectMenus/${file}`);
                        if (menu.id) {
                            client.selectMenuCache.set(menu.id, menu);
                        }
                    }
                }

                const menu = client.selectMenuCache.get(interaction.customId);
                if (!menu) return;

                return await menu.execute(interaction, client, config);
            }

            // ======================
            // 🧾 MODALS
            // ======================
            if (interaction.isModalSubmit()) {

                try {
                    const modalPath = path.join(__dirname, `../modals/${interaction.customId}.js`);

                    if (!fs.existsSync(modalPath)) return;

                    const modal = require(modalPath);
                    if (!modal || !modal.execute) return;

                    return await modal.execute(interaction, client, config);

                } catch (err) {
                    console.error('Modal Error:', err);
                }
            }

        } catch (err) {
            console.error(err);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Fehler im Interaction Handler',
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};
