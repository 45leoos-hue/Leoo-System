const config = require('../config.js');
const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    id: "claim_ticket",

    async execute(interaction, client) {

        const member = interaction.member;
        const channel = interaction.channel;

        // 📌 Ticket Infos holen
        const topic = channel.topic;

        if (!topic) {
            return interaction.reply({
                content: "❌ Ticket Daten fehlen!",
                ephemeral: true
            });
        }

        const [userId, type] = topic.split("|");

        // 🔥 Rollen je Ticket
        const rolesByType = {
            support: [
                config.ticketRoles.support,
                config.ticketRoles.coleitung,
                config.ticketRoles.leitung,
                config.ticketRoles.allperms
            ],
            buy: [
                config.ticketRoles.buy,
                config.ticketRoles.coleitung,
                config.ticketRoles.leitung,
                config.ticketRoles.allperms
            ],
            teambewerbung: [
                config.ticketRoles.teambewerbung,
                config.ticketRoles.coleitung,
                config.ticketRoles.leitung,
                config.ticketRoles.allperms
            ]
            
        };

        const allowedRoles = rolesByType[type];

        if (!allowedRoles) {
            return interaction.reply({
                content: "❌ Ticket Typ Fehler!",
                ephemeral: true
            });
        }

        // 🔒 Check ob User passende Rolle hat
        const hasPermission = member.roles.cache.some(role =>
            allowedRoles.includes(role.id)
        );

        if (!hasPermission) {
            return interaction.reply({
                content: "❌ Du darfst dieses Ticket nicht claimen!",
                ephemeral: true
            });
        }

        // 🚫 Schon übernommen?
        if (channel.name.startsWith("claimed-")) {
            return interaction.reply({
                content: "❌ Ticket wurde bereits geclaimed!",
                ephemeral: true
            });
        }

        // 🏷️ Channel umbenennen
        await channel.setName(`claimed-${channel.name}`).catch(() => {});

        // 🔒 Rollen dürfen NICHT mehr schreiben
        for (const roleId of allowedRoles) {
            await channel.permissionOverwrites.edit(roleId, {
                SendMessages: false
            }).catch(() => {});
        }

        // 👤 Claimer darf schreiben
        await channel.permissionOverwrites.edit(interaction.user.id, {
            SendMessages: true,
            ViewChannel: true
        });

        // 🎨 Embed Nachricht
        const embed = new EmbedBuilder()
            .setColor("#00ff88")
            .setTitle("🎟️ Ticket claimed")
            .setDescription(`Dieses Ticket wurde von <@${interaction.user.id}> geclaimed!`)
            .setTimestamp();

        // 🔥 Button ändern → Unclaim
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('unclaim_ticket')
                .setLabel('Freigeben')
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        // ======================
        // 📝 LOG SYSTEM (CLAIM)
        // ======================
        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle("👤 Ticket claimed")
                .addFields(
                    { name: "👤 Supporter", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "📂 Kategorie", value: type, inline: true },
                    { name: "📍 Channel", value: `${channel}`, inline: true }
                )
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};