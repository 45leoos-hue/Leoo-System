const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'embed_modal',

    async execute(interaction, client) {

        const titel = interaction.fields.getTextInputValue('titel');
        const beschreibung = interaction.fields.getTextInputValue('beschreibung');
        const farbe = interaction.fields.getTextInputValue('farbe');
        const bild = interaction.fields.getTextInputValue('bild');
        const thumbnail = interaction.fields.getTextInputValue('thumbnail');
        const footer = interaction.fields.getTextInputValue('footer');
        const author = interaction.fields.getTextInputValue('author');

        let embed = client.embedCache.get(interaction.user.id) || new EmbedBuilder();

        embed.setColor(farbe || '#5865F2');

        if (titel) embed.setTitle(titel);
        if (beschreibung) embed.setDescription(beschreibung);
        if (bild) embed.setImage(bild);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (footer) embed.setFooter({ text: footer });
        if (author) embed.setAuthor({ name: author });

        client.embedCache.set(interaction.user.id, embed);

        await interaction.reply({
            content: '✅ Vorschau aktualisiert',
            embeds: [embed],
            ephemeral: true
        });
    }
};