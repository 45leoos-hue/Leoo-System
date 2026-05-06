const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config');
const warnManager = require('../utils/roleWarnManager');

module.exports = {
    name: Events.GuildMemberUpdate,

    async execute(oldMember, newMember) {

        const protectedRoles = config.protectedRoleIds;
        if (!protectedRoles || !protectedRoles.length) return;

        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        for (const roleId of protectedRoles) {

            if (!oldRoles.has(roleId) && newRoles.has(roleId)) {

                let executor = null;

                try {
                    const logs = await newMember.guild.fetchAuditLogs({
                        limit: 1,
                        type: 25
                    });

                    const entry = logs.entries.first();

                    if (entry && entry.target.id === newMember.id) {
                        executor = entry.executor;
                    }

                } catch (e) {}

                // ======================
                // 🔐 ADMIN BYPASS
                // ======================
                if (executor) {

                    const executorMember = await newMember.guild.members.fetch(executor.id).catch(() => null);

                    if (
                        executorMember &&
                        config.bypassRoleIds &&
                        executorMember.roles.cache.some(r => config.bypassRoleIds.includes(r.id))
                    ) {
                        return;
                    }
                }

                // 👉 SELF GIVE DETECTED
                if (executor && executor.id === newMember.id) {

                    // ❌ Rolle entfernen
                    await newMember.roles.remove(roleId).catch(() => {});

                    // ➕ Warn erhöhen
                    const warns = warnManager.add(newMember.id);

                    // ======================
                    // 💀 AUTO BAN + DM EMBED
                    // ======================
                    if (warns === 3) {

                        const dmEmbed = new EmbedBuilder()
                            .setColor('#ff4d4d')
                            .setAuthor({ name: 'Leoo Security System' })
                            .setTitle('🚨 Du wurdest gebannt')
                            .setDescription('Du hast die maximale Anzahl an Verwarnungen erreicht.')
                            .addFields(
                                { name: '📊 Warnstatus', value: `${warns}/3`, inline: true },
                                { name: '⚠️ Grund', value: 'Mehrfacher Role Abuse', inline: true }
                            )
                            .setFooter({ text: 'Leoo Protection aktiv' })
                            .setTimestamp();

                        await newMember.send({ embeds: [dmEmbed] }).catch(() => {});

                        await newMember.ban({
                            reason: '3 Warns erreicht (Role Abuse)'
                        }).catch(() => {});

                        // ======================
                        // 📜 BAN LOG (NEU)
                        // ======================
                        const banLogChannel = newMember.guild.channels.cache.get(config.banLogChannelId);

                        if (banLogChannel) {

                            const banEmbed = new EmbedBuilder()
                                .setColor('#ff0000')
                                .setAuthor({ name: 'Leoo Ban System' })
                                .setTitle('🔨 Benutzer gebannt')
                                .addFields(
                                    { name: '👤 User', value: `<@${newMember.id}>`, inline: true },
                                    { name: '📊 Grund', value: '3 Warns erreicht', inline: true },
                                    { name: '⚠️ System', value: 'Auto Moderation', inline: true }
                                )
                                .setFooter({ text: 'Leoo Protection' })
                                .setTimestamp();

                            banLogChannel.send({ embeds: [banEmbed] });
                        }
                    }

                    // ======================
                    // 🔥 PROGRESSIVE WARN ROLLEN
                    // ======================
                    if (config.warnRoles && Array.isArray(config.warnRoles)) {

                        for (const rId of config.warnRoles) {
                            if (newMember.roles.cache.has(rId)) {
                                await newMember.roles.remove(rId).catch(() => {});
                            }
                        }

                        const roleToGive = config.warnRoles[warns - 1];
                        if (roleToGive) {
                            await newMember.roles.add(roleToGive).catch(console.error);
                        }
                    }

                    // 📜 LOG
                    const logChannel = newMember.guild.channels.cache.get(config.roleLogChannelId);

                    if (logChannel) {
                        const embed = new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle('⚠️ Role Abuse erkannt')
                            .addFields(
                                { name: 'User', value: `<@${newMember.id}>` },
                                { name: 'Rolle', value: `<@&${roleId}>` },
                                { name: 'Warns', value: `${warns}/3` },
                                { name: 'Status', value: warns >= 3 ? '🚨 MAX WARN ERREICHT' : 'Beobachtung' }
                            )
                            .setTimestamp();

                        logChannel.send({ embeds: [embed] });
                    }
                }
            }
        }

        // ======================
        // 🔒 WARN ROLE REMOVE BLOCK
        // ======================
        if (config.warnRoles && Array.isArray(config.warnRoles)) {

            for (const roleId of config.warnRoles) {

                if (oldRoles.has(roleId) && !newRoles.has(roleId)) {

                    let executor = null;

                    try {
                        const logs = await newMember.guild.fetchAuditLogs({
                            limit: 1,
                            type: 25
                        });

                        const entry = logs.entries.first();

                        if (entry && entry.target.id === newMember.id) {
                            executor = entry.executor;
                        }

                    } catch (e) {}

                    // 👉 SELF REMOVE DETECTED
                    if (executor && executor.id === newMember.id) {

                        await newMember.roles.add(roleId).catch(() => {});

                        const logChannel = newMember.guild.channels.cache.get(config.roleLogChannelId);

                        if (logChannel) {
                            const embed = new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('🔒 Warn Rolle entfernt (BLOCKED)')
                                .addFields(
                                    { name: 'User', value: `<@${newMember.id}>` },
                                    { name: 'Rolle', value: `<@&${roleId}>` }
                                )
                                .setTimestamp();

                            logChannel.send({ embeds: [embed] });
                        }
                    }
                }
            }
        }
    }
};