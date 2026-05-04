const { EmbedBuilder } = require('discord.js');
const config = require('../config.js') 

module.exports = {
    name: 'guildMemberAdd',

    async execute(member, client) {
        try {

            await member.roles.add(config.unverifyedRoleId);

            const channel = member.guild.channels.cache.get(config.welcomeChannelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle('〨 | LEOO Settings')
                .setDescription(
                    `<:herz1:1499852268273537054> **Willkommen ${member} auf ${member.guild.name}**\n\n` +
                    `> <:emoji1:1499846963070373888> **Memberanzahl:** ${member.guild.memberCount}\n` +
                    `> <:regeln1:1499853243704938536> **Regeln:** <#1492714385666347109>\n` +
                    `> <:haken1:1499859150681935982> **Verify:** <#1492722075612483684>\n\n\n` +
                    '**Danke, dass du beigetreten bist!**'
                )
                .setColor('#0020ff')
                .setImage('https://cdn.discordapp.com/attachments/1499848010950115430/1499863185249931495/Leoo_Welcome.png')
                .setThumbnail(member.user.displayAvatarURL());

            await channel.send({ embeds: [embed] });

        } catch (err) {
            console.error("WELCOME ERROR:", err);
        }
    }
};