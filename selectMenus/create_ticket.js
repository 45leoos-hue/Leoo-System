const config = require('../config.js');
const { 
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    id: "ticket_create",

    async execute(interaction, client) {

        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "ticket_create") return;

        // 🔥 FIX: sauberer Type (trim + lowercase)
        let type = interaction.values[0].toLowerCase().trim();

        // 🔥 FIX: Mapping erweitert (falls falsche values kommen)
        const typeMap = {
    apply: "teambewerbung",
    team: "teambewerbung",
    bewerbung: "teambewerbung",
    "team-bewerbung": "teambewerbung",
    "team_bewerbung": "teambewerbung",

    // 🔥 DAS HIER HINZUFÜGEN
    teambw: "teambewerbung"
};

        const finalType = typeMap[type] || type;

        const categoryId = config.ticketCategories[finalType];

        if (!categoryId) {
            console.log("❌ TYPE:", type);
            console.log("❌ FINAL TYPE:", finalType);
            console.log("❌ CATEGORY:", config.ticketCategories[finalType]);

            return interaction.reply({
                content: '❌ Ticket Fehler (Config prüfen)',
                ephemeral: true
            });
        }

        // 🔥 ROLLEN PRO TICKET
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

        const roles = rolesByType[finalType];

        if (!roles) {
            return interaction.reply({
                content: '❌ Rollen nicht gefunden!',
                ephemeral: true
            });
        }

        // 🚫 Doppel Ticket verhindern
        const existing = interaction.guild.channels.cache.find(
            c => c.topic?.startsWith(interaction.user.id)
        );

        if (existing) {
            return interaction.reply({
                content: `❌ Du hast bereits ein Ticket: ${existing}`,
                ephemeral: true
            });
        }

        // 📂 Channel erstellen
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: `${interaction.user.id}|${finalType}`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                ...roles.map(roleId => ({
                    id: roleId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                }))
            ]
        });

        // 🎨 Unterschiedliche Ticket Nachrichten
        const ticketData = {
            support: {
                title: "<:zahnrad3:1500853586651775187> Support Ticket", 
                color: "#e7d910",
                text: `
                    
                   Bitte beschreibe dein Problem so genau wie möglich.

                   **Inhalt:**
                       ⚬ Was ist passiert?
                       ⚬ Seit wann besteht das Problem?
                       ⚬ Gibt es Fehlermeldungen?
                       ⚬ Screenshots (falls möglich)

                   Ein Supporter wird sich gleich um dich kümmern.
                `
            },
            buy: {
                title: "<:cart3:1500854597277847593> Buy Ticket",
                color: "#2ecc71",
                text: `

                  Bitte beschreibe, was du kaufen möchtest.

                  **Inhalt:**
                    ⚬ Welches Produkt möchtest du kaufen?
                    ⚬ Welche Menge / Variante?
                    ⚬ Welche Zahlungsmethode bevorzugst du?
                    ⚬ Weitere Wünsche oder Fragen?

                    Ein Teammitglied wird sich gleich bei dir melden.
                `
           },
            teambewerbung: {
                title: "<:menschen1:1500477116708294736> Teambewerbung",
                color: "#3498db",
                text: `

                  Bitte schreibe hier deine Bewerbung für unser Team.

                  **Inhalt der Bewerbung:**
                    ⚬ Dein Alter:
                    ⚬ Deine Erfahrung:
                    ⚬ Warum möchtest du ins Team?
                    ⚬ Deine Stärken & Schwächen:
                    ⚬ Wie viel Zeit kannst du investieren?

                  Ein Admin wird deine Bewerbung prüfen und sich bei dir melden.
               `
         }
        };

        const data = ticketData[finalType];

        if (!data) {
            return interaction.reply({
                content: `❌ Fehler: Ticket Typ "${type}" nicht gefunden!`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(
                ` Willkommen <@${interaction.user.id}>\n\n${data.text}`
            )
            .setColor(data.color)
            .setTimestamp();

        // 🔘 Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('claim_ticket')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
            content: `${roles.map(r => `<@&${r}>`).join(' ')}`,
            embeds: [embed],
            components: [row]
        });

        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor("#00ff88")
                .setTitle("🎟️ Ticket erstellt")
                .addFields(
                    { name: "👤 User", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "📂 Kategorie", value: finalType, inline: true },
                    { name: "📍 Channel", value: `${channel}`, inline: true }
                )
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }

        return interaction.reply({
            content: `✅ Ticket erstellt: ${channel}`,
            ephemeral: true
        });
    }
};