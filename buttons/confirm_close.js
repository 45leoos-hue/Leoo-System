const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
    id: "confirm_close",

    async execute(interaction) {

        const channel = interaction.channel;

        const topic = channel.topic;
        if (!topic) {
            return interaction.reply({
                content: "❌ Ticket Daten fehlen!",
                ephemeral: true
            });
        }

        const [userId, type] = topic.split("|");

        // 👤 User holen
        const user = await interaction.client.users.fetch(userId).catch(() => null);

        // 📄 Nachrichten holen (letzte 100)
        const messages = await channel.messages.fetch({ limit: 100 });

        const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        let transcript = "";

        sorted.forEach(msg => {
            transcript += `[${new Date(msg.createdTimestamp).toLocaleString()}] ${msg.author.tag}: ${msg.content || "[Embed / Datei / Bild]"}\n`;
        });

        // 📄 Datei erstellen
        const buffer = Buffer.from(transcript, "utf-8");

        const file = new AttachmentBuilder(buffer, {
            name: `transcript-${channel.name}.txt`
        });

        // 🔒 Ephemeral Nachricht
        await interaction.reply({
            content: 'Ticket wird geschlossen...',
            ephemeral: true
        });

        // ======================
        // 📝 LOG SYSTEM (CLOSE)
        // ======================
        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("🔒 Ticket geschlossen")
                .addFields(
                    { name: "👤 Geschlossen von", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "👤 Ticket Owner", value: `<@${userId}>`, inline: true },
                    { name: "📂 Kategorie", value: type, inline: true },
                    { name: "📍 Channel", value: `${channel.name}`, inline: true }
                )
                .setTimestamp();

            logChannel.send({
                embeds: [logEmbed],
                files: [file]
            });
        }

        // ======================
        // 📩 DM AN USER (MIT EMBED)
        // ======================
        if (user) {

            const dmEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("🔒 Ticket geschlossen")
                .setDescription(`Dein Ticket wurde erfolgreich geschlossen.

📂 Kategorie: ${type}
📄 Dein Transcript ist unten angehängt.

Danke für dein Ticket!`)
                .setTimestamp();

            user.send({
                embeds: [dmEmbed],
                files: [file]
            }).catch(() => {
                console.log("Konnte keine DM senden.");
            });
        }

        // ⏳ Löschen nach 3 Sekunden
        setTimeout(() => {
            channel.delete().catch(() => {});
        }, 3000);
    }
};