const { SlashCommandBuilder } = require('discord.js');
const { leakRoleId } = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leak')
        .setDescription('Poste ein Leak')
        .addAttachmentOption(option =>
            option.setName('showcase')
                .setDescription('Vorschaubild')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('download')
                .setDescription('Download Datei')
                .setRequired(true)),

    async execute(interaction) {

        // ⏱️ WICHTIG: Interaction sofort "bestätigen"
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.roles.cache.has(leakRoleId)) {
            return interaction.editReply({
                content: '❌ Du hast keine Berechtigung'
            });
        }

        const showcase = interaction.options.getAttachment('showcase');
        const download = interaction.options.getAttachment('download');

        // Nachricht im Channel senden
        await interaction.channel.send({
            files: [showcase.url, download.url]
        });

        // Antwort an User (ephemeral)
        await interaction.editReply({
            content: '✅ Erfolgreich gesendet'
        });
    }
};