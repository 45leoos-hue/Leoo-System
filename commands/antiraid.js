const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antiraid')
        .setDescription('Aktiviere/Deaktiviere Anti Raid')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('on / off')
                .setRequired(true)
                .addChoices(
                    { name: 'ON', value: 'on' },
                    { name: 'OFF', value: 'off' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {

        const status = interaction.options.getString('status');

        if (!client.antiRaid) client.antiRaid = new Map();

        if (status === 'on') {
            client.antiRaid.set(interaction.guild.id, {
                joins: [],
                actions: {}
            });

            return interaction.reply({
                content: '🛡️ Anti-Raid aktiviert!',
                ephemeral: true
            });
        }

        if (status === 'off') {
            client.antiRaid.delete(interaction.guild.id);

            return interaction.reply({
                content: '❌ Anti-Raid deaktiviert!',
                ephemeral: true
            });
        }
    }
};