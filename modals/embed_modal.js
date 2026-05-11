const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'embed_modal',

    async execute(interaction, client) {

        const titel = interaction.fields.getTextInputValue('titel');
        const beschreibung = interaction.fields.getTextInputValue('beschreibung');
        const farbe = interaction.fields.getTextInputValue('farbe');
        const bild = interaction.fields.getTextInputValue('bild');
        const thumbnail = interaction.fields.getTextInputValue('thumbnail');

        let embed = client.embedCache.get(interaction.user.id) || new EmbedBuilder();

        if (farbe) embed.setColor(farbe);
        if (titel) embed.setTitle(titel);
        if (beschreibung) embed.setDescription(beschreibung);
        if (bild) embed.setImage(bild);
        if (thumbnail) embed.setThumbnail(thumbnail); // ✅ HIER

        client.embedCache.set(interaction.user.id, embed);

        await interaction.reply({
            content: '✅ Embed aktualisiert',
            embeds: [embed],
            flags: 64
        });
    }
};
