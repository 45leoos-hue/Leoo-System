const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bl = require('../utils/blacklistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist System')

        // ➕ ADD
        .addSubcommand(cmd =>
            cmd.setName('add')
                .setDescription('Fügt einen User zur Blacklist hinzu')
                .addUserOption(o =>
                    o.setName('user')
                        .setDescription('Der User')
                        .setRequired(true))
                .addStringOption(o =>
                    o.setName('type')
                        .setDescription('Blacklist Typ')
                        .setRequired(true)
                        .addChoices(
                            { name: 'HARD (Ban)', value: 'hard' },
                            { name: 'SOFT (Kick)', value: 'soft' }
                        ))
                .addStringOption(o =>
                    o.setName('reason')
                        .setDescription('Grund der Blacklist'))
        )

        // ❌ REMOVE
        .addSubcommand(cmd =>
            cmd.setName('remove')
                .setDescription('Entfernt einen User von der Blacklist')
                .addUserOption(o =>
                    o.setName('user')
                        .setDescription('Der User')
                        .setRequired(true))
        )

        // 📜 LIST
        .addSubcommand(cmd =>
            cmd.setName('list')
                .setDescription('Zeigt die Blacklist an')
        ),

    async execute(interaction, client, config) {

        if (!interaction.member.roles.cache.has(config.blacklistRoleId)) {
            return interaction.reply({ content: '❌ Keine Berechtigung', ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        // ➕ ADD
        if (sub === 'add') {

            const user = interaction.options.getUser('user');
            const type = interaction.options.getString('type');
            const reason = interaction.options.getString('reason') || 'Kein Grund';

            const added = bl.add(user.id, {
                type,
                reason,
                by: interaction.user.id,
                time: Date.now()
            });

            if (!added) {
                return interaction.reply({ content: '❌ Bereits geblacklisted', ephemeral: true });
            }

            await user.send(`🚫 Du wurdest geblacklisted\nGrund: ${reason}`).catch(() => {});

            const member = interaction.guild.members.cache.get(user.id);
            if (member) {
                if (type === 'hard') {
                    await member.ban({ reason }).catch(() => {});
                } else {
                    await member.kick(reason).catch(() => {});
                }
            }

            const embed = new EmbedBuilder()
                .setColor('Black')
                .setTitle('Blacklisted.')
                .addFields(
                    { name: 'User', value: `<@${user.id}>` },
                    { name: 'Typ', value: type },
                    { name: 'Grund', value: reason },
                    { name: 'Von', value: `<@${interaction.user.id}>` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            const log = interaction.guild.channels.cache.get(config.blacklistLogChannelId);
            if (log) log.send({ embeds: [embed] });
        }

        // ❌ REMOVE
        if (sub === 'remove') {

            const user = interaction.options.getUser('user');

            bl.remove(user.id);

            await interaction.guild.bans.remove(user.id).catch(() => {});

            return interaction.reply(`✅ ${user.tag} entfernt + entbannt`);
        }

        // 📜 LIST
        if (sub === 'list') {

            const data = bl.getAll();

            if (!data.length) {
                return interaction.reply({ content: '📜 Leer', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('Black')
                .setTitle('Blacklisted');

            data.slice(0, 10).forEach(u => {
                embed.addFields({
                    name: `<@${u.id}> (${u.type})`,
                    value: `Grund: ${u.reason}\nVon: <@${u.by}>`
                });
            });

            interaction.reply({ embeds: [embed] });
        }
    }
};