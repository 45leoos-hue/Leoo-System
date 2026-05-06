const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'channelDelete',

    async execute(channel, client) {

        const guild = channel.guild;
        const data = client.antiRaid?.get(guild.id);
        if (!data) return;

        const logs = await guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
            limit: 1
        });

        const entry = logs.entries.first();
        if (!entry) return;

        const user = entry.executor;

        if (!data.actions[user.id]) data.actions[user.id] = 0;
        data.actions[user.id]++;

        if (data.actions[user.id] >= 3) {
            const member = await guild.members.fetch(user.id);
            await member.ban({ reason: 'Anti-Nuke System' });
        }

        setTimeout(() => {
            data.actions[user.id] = 0;
        }, 10000);
    }
};