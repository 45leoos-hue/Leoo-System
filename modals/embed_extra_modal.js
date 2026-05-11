const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'embed_extra_modal',

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('embed_extra_modal')
            .setTitle('Embed Extras');

        const fields = [
            ['thumbnail', 'Thumbnail URL'],
            ['author', 'Author Name']
        ];

        const rows = fields.map(([id, label]) =>
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId(id)
                    .setLabel(label)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        modal.addComponents(...rows);

        await interaction.showModal(modal);
    }
};