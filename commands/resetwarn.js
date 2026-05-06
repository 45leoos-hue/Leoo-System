const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const warnManager = require('../utils/roleWarnManager');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetwarn')
        .setDescription('Setzt die Warns eines Users zurück')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });
        }

        // 🔄 Warns resetten
        warnManager.reset(user.id);

        // 🔥 Warn Rollen entfernen
        if (config.warnRoles && Array.isArray(config.warnRoles)) {
            for (const roleId of config.warnRoles) {
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId).catch(() => {});
                }
            }
        }

        await interaction.reply({
            content: `✅ Warns von <@${user.id}> wurden zurückgesetzt.`,
            ephemeral: true
        });
    }
};