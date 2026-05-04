const { EmbedBuilder } = require('discord.js');
const config = require('../config.js') 

module.exports = {
    name: 'guildMemberRemove',

    async execute(member, client) {
        try {

            const channel = member.guild.channels.cache.get(config.leaveChannelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle('〨 | LEOO Settings')
                .setDescription(
                    `<:herz1:1499852268273537054> **Wir verabschieden ${member} von ${member.guild.name}**\n\n` +
                    `> <:emoji1:1499846963070373888> **Memberanzahl:** ${member.guild.memberCount}\n\n\n` +
                    `**Vielleicht kommst du ja wieder zurück...**`
                )
                .setColor('#0020ff')
                .setImage('https://cdn.discordapp.com/attachments/1494369413724508260/1499875776206733403/65475610-71C7-4AA5-B2D7-334EC0FAFECD.png')
                .setThumbnail(member.user.displayAvatarURL());

            await channel.send({ embeds: [embed] });

        } catch (err) {
            console.error("LEAVE ERROR:", err);
        }
    }
};