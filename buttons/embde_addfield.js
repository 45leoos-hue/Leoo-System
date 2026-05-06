const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'embed_addfield',

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('embed_field_modal')
            .setTitle('Field hinzufügen');

        const name = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Field Name')
            .setStyle(TextInputStyle.Short);

        const value = new TextInputBuilder()
            .setCustomId('value')
            .setLabel('Field Value')
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
            new ActionRowBuilder().addComponents(name),
            new ActionRowBuilder().addComponents(value)
        );

        await interaction.showModal(modal);
    }
};