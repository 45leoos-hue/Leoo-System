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

        if (!interaction.member.roles.cache.has(leakRoleId)) {
            return interaction.reply({
                content: '❌ Du hast keine Berechtigung',
                ephemeral: true
            });
        }    

        const showcase = interaction.options.getAttachment('showcase');
        const download = interaction.options.getAttachment('download');

        // ✅ Ephemeral Antwort (kein "verwendet /leak" sichtbar)
        await interaction.reply({
            content: '✅ Erfolgreich gesendet',
            ephemeral: true
        });

        // ✅ Normale Nachricht im Channel (wie User-Post)
        await interaction.channel.send({
            files: [showcase.url, download.url]
        });
    }
};