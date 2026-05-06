const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,

    async execute(oldMember, newMember, client) {

        const logChannelId = require('../config').roleLogChannelId;
        if (!logChannelId) return;

        const logChannel = newMember.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // ➕ Rollen hinzugefügt
        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));

        // ❌ Rollen entfernt
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (!addedRoles.size && !removedRoles.size) return;

        // 🔍 Audit Log holen (wer hat's gemacht)
        let executor = "Unbekannt";

        try {
            const logs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 25 // MEMBER_ROLE_UPDATE
            });

            const entry = logs.entries.first();

            if (entry && entry.target.id === newMember.id) {
                executor = `<@${entry.executor.id}>`;
            }
        } catch (e) {}

        // ➕ Rollen ADD
        if (addedRoles.size) {
            addedRoles.forEach(role => {

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('➕ Rolle hinzugefügt')
                    .addFields(
                        { name: 'User', value: `<@${newMember.id}>` },
                        { name: 'Rolle', value: `<@&${role.id}>` },
                        { name: 'Von', value: executor }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            });
        }

        // ❌ Rollen REMOVE
        if (removedRoles.size) {
            removedRoles.forEach(role => {

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Rolle entfernt')
                    .addFields(
                        { name: 'User', value: `<@${newMember.id}>` },
                        { name: 'Rolle', value: `<@&${role.id}>` },
                        { name: 'Von', value: executor }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            });
        }
    }
};