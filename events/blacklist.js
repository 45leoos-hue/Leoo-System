const bl = require('../utils/blacklistManager');

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {

        const entry = bl.get(member.id);
        if (!entry) return;

        const age = Date.now() - member.user.createdTimestamp;

        // Alt Account (< 3 Tage)
        if (age < 1000 * 60 * 60 * 24 * 3) {
            await member.ban({ reason: 'Alt Account Blacklist' }).catch(() => {});
            return;
        }

        if (entry.type === 'hard') {
            await member.ban({ reason: entry.reason }).catch(() => {});
        } else {
            await member.kick(entry.reason).catch(() => {});
        }
    }
};