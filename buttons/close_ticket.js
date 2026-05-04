const config = require('../config.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: "close_ticket",

    async execute(interaction) {

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_close')
                .setLabel('Ja, schließen')
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId('cancel_close')
                .setLabel('Abbrechen')
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
            content: '❗ Willst du das Ticket wirklich schließen?',
            components: [row],
            ephemeral: true
        });
    }
};