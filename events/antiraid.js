const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    async execute(member, client) {

        const data = client.antiRaid?.get(member.guild.id);
        if (!data) return;

        const now = Date.now();

        data.joins.push(now);

        // nur letzte 10 Sekunden behalten
        data.joins = data.joins.filter(t => now - t < 10000);

        if (data.joins.length > 5) {
            await member.kick('Anti-Raid Schutz');
        }
    }
};