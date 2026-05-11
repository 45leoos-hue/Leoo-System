const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'embed_edit',

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('embed_modal')
            .setTitle('Embed bearbeiten');

        // ✅ MAX 5 Felder!
        const fields = [
            ['titel', 'Titel'],
            ['beschreibung', 'Beschreibung', true],
            ['farbe', 'Farbe (#hex)'],
            ['bild', 'Bild URL'],
            ['footer', 'Footer']
        ];

        const rows = fields.map(([id, label, long]) =>
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId(id)
                    .setLabel(label)
                    .setStyle(long ? TextInputStyle.Paragraph : TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        modal.addComponents(...rows);

        await interaction.showModal(modal);
    }
};
