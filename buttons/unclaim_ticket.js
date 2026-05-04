const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const config = require('../config.js');

module.exports = {
    id: "unclaim_ticket",

    async execute(interaction, client) {

        // ✅ WICHTIG: sofort defer (fix für Fehler)
        await interaction.deferReply();

        const member = interaction.member;
        const channel = interaction.channel;

        const topic = channel.topic;
        if (!topic) {
            return interaction.editReply({
                content: "❌ Ticket Daten fehlen!"
            });
        }

        const [userId, type] = topic.split("|");

        // 🔥 GLEICHE LOGIK WIE CLAIM
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
            return interaction.editReply({
                content: "❌ Ticket Typ Fehler!"
            });
        }

        // 🔒 Permission Check
        const hasPermission = member.roles.cache.some(role =>
            allowedRoles.includes(role.id)
        );

        if (!hasPermission) {
            return interaction.editReply({
                content: "❌ Du darfst das Ticket nicht freigeben!"
            });
        }

        // 🔓 Rollen dürfen wieder schreiben
        for (const roleId of allowedRoles) {
            await channel.permissionOverwrites.edit(roleId, {
                SendMessages: true
            }).catch(() => {});
        }

        // 🏷️ Channel Name zurücksetzen
        const newName = channel.name.replace("claimed-", "");
        await channel.setName(newName).catch(() => {});

        // 🎨 Embed
        const embed = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("🔓 Ticket freigeben?")
            .setDescription(`Dieses Ticket wurde freigegeben von <@${interaction.user.id}>`)
            .setTimestamp();

        // 🔘 Buttons zurücksetzen
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('claim_ticket')
                .setLabel('Übernehmen')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
        );

        // ✅ WICHTIG: editReply statt reply
        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });

        // ======================
        // 📝 LOG SYSTEM (UNCLAIM)
        // ======================
        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("🔓 Ticket unclaimen?")
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