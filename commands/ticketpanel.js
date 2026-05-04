const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require('discord.js');

const config = require('../config.js') 

// 🔥 Mapping für Anzeige (nur UI)
const ticketOptions = {
    buy: {
        label: 'Kaufen',
        description: 'Kaufe ein Produkt',
        emoji: '<:cart3:1500854597277847593>'
    },
    support: {
        label: 'Allgemeiner Support',
        description: 'Hilfe & Fragen',
        emoji: '<:zahnrad3:1500853586651775187>'
    },
    teambewerbung: {
        label: 'Teambewerbung',
        description: 'Bewerbe dich für unser Team',
        emoji: '<:menschen1:1500477116708294736>'
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketpanel')
        .setDescription('Erstellt das Ticket Panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        // 🔒 Schutz vor doppeltem Panel
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const existingPanel = messages.find(msg => msg.components.length > 0);

        if (existingPanel) {
            return interaction.reply({
                content: '❌ In diesem Channel existiert bereits ein Ticket Panel!',
                ephemeral: true
            });
        }

        // 📜 Dynamische Beschreibung
        const descriptionList = Object.keys(config.ticketCategories)
            .map(key => {
                const data = ticketOptions[key];
                if (!data) return null;
                return `${data.emoji} **${data.label}** - ${data.description}`;
            })
            .filter(Boolean)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('<:ticket1:1500856340455751700> Ticket-System')
            .setDescription(
                `<:ordner2:1500856292942811207> **Wähle eine Kategorie aus:**\n\n${descriptionList}\n\n <:warn1:1500855502136148065> **Missbrauch führt zu einem Ban!**`
            )
            .setColor('#0020ff')
            .setImage('https://cdn.discordapp.com/attachments/1494369413724508260/1498722832526475405/ChatGPT_Image_28._Apr._2026_18_05_00.png');
        
        
            // 🔽 Dropdown Optionen
        const options = Object.keys(config.ticketCategories)
            .map(key => {
                const data = ticketOptions[key];
                if (!data) return null;

                return {
                    label: data.label,
                    description: data.description,
                    value: key,
                    emoji: data.emoji || undefined
                };
            })
            .filter(Boolean);

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_create')
                .setPlaceholder('Wähle dein Anliegen aus...')
                .addOptions(options)
        );

        await interaction.channel.send({
            embeds: [embed],
            components: [menu]
        });

        await interaction.reply({
            content: '✅ Ticket Panel erfolgreich erstellt!',
            ephemeral: true
        });
    }
};