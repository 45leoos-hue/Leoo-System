const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Starte den Embed Builder'),

    async execute(interaction, client) {

        if (!client.embedCache) {
            client.embedCache = new Map();
        }

        const embed = new EmbedBuilder()
            .setTitle('📝 Embed Builder')
            .setDescription('Nutze die Buttons unten, um dein Embed zu erstellen')
            .setColor('#5865F2');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('embed_edit')
                .setLabel('✏️ Bearbeiten')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('embed_addfield')
                .setLabel('➕ Field')
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId('embed_send')
                .setLabel('📤 Senden')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId('embed_cancel')
                .setLabel('❌ Abbrechen')
                .setStyle(ButtonStyle.Danger)
        );

        client.embedCache.set(interaction.user.id, new EmbedBuilder());

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
