const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Öffnet den Embed Builder'),

    async execute(interaction, client) {

        // Embed Cache vorbereiten
        if (!client.embedCache) {
            client.embedCache = new Map();
        }

        // Neues leeres Embed speichern
        client.embedCache.set(interaction.user.id, new EmbedBuilder().setColor('#5865F2'));

        // Builder UI Embed (wie dein Screenshot)
        const builderEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📝 Embed Builder')
            .setDescription('Nutze die Buttons unten, um dein Embed zu erstellen');

        // Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('embed_edit')
                .setLabel('Bearbeiten')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('✏️'),

            new ButtonBuilder()
                .setCustomId('embed_send')
                .setLabel('Senden')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📩'),

            new ButtonBuilder()
                .setCustomId('embed_cancel')
                .setLabel('Abbrechen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
        );

        // Antwort senden
        await interaction.reply({
            embeds: [builderEmbed],
            components: [row],
            ephemeral: true
        });
    }
};
