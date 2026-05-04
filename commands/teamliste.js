const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const generateTeamEmbed = require('../utils/generateTeamEmbed');

module.exports = {
    // ======================
    // SLASH COMMAND
    // ======================
    data: new SlashCommandBuilder()
        .setName('teamliste')
        .setDescription('Zeigt die Teamliste an'),

    // ======================
    // EXECUTE
    // ======================
    async execute(interaction) {

        const embed = await generateTeamEmbed(interaction.guild);

        await interaction.channel.send({ embeds: [embed] });

        return interaction.editReply({ content: '✅ Gesendet' });
    }
};