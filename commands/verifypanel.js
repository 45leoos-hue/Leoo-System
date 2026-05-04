const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'verifypanel',

    async execute(interaction, client, config) {

        await interaction.deferReply({ ephemeral: true });

        const button = new ButtonBuilder()
            .setCustomId('verify_btn')
            .setLabel('🔐 Verifizieren')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setTitle('✅ ・ Verify')
            .setDescription('Klicke unten zum verifizieren')
            .setColor('#0020ff');

        const channel = interaction.guild.channels.cache.get(config.verifyChannelId);

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        return interaction.editReply({
            content: '✅ Verify Panel gesendet!'
        });
    }
};