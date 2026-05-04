const { EmbedBuilder } = require('discord.js');
const config = require('../config.js') 


async function generateTeamEmbed(guild) {

    
    await guild.members.fetch();

    let description = '';

    for (const roleId of config.teamRoles) {

        const role = guild.roles.cache.get(roleId);
        if (!role) continue;

        
        const members = role.members
            .map(m => `⚬ <@${m.id}>`)
            .join('\n');

        description += `**<@&${role.id}>**\n`;
        description += members || '⚬';
        description += '\n\n';
    }

    return new EmbedBuilder()
    .setColor('#023fb9')
    .setImage('https://cdn.discordapp.com/attachments/1494369413724508260/1498722832526475405/ChatGPT_Image_28._Apr._2026_18_05_00.png')
    .setDescription(
    `# <:menschen1:1500477116708294736> TEAMLISTE\n` +
    `╾╾╾╾╾╾╾╾╾╾╾╾ ✦ ╾╾╾╾╾╾╾╾╾╾╾╾\n\n` +
    (description || '❌ Keine Teams gefunden')
);
}

module.exports = generateTeamEmbed;