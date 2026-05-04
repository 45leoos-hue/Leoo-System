const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../config.js') 

module.exports = {
    // ======================
    // SLASH COMMAND
    // ======================
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Entbannt einen User vom Server')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('User ID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true)
        ),

    // ======================
    // EXECUTE
    // ======================
    async execute(interaction, client) {

        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.roles.cache.has(config.banAllowedRoleId)) {
            return interaction.editReply({ content: "❌ Keine Berechtigung!" });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('grund');
        const moderator = interaction.user;

        if (!userId) {
            return interaction.editReply({ content: "❌ User ID fehlt!" });
        }

        await interaction.guild.members.unban(userId);

        try {
            const user = await client.users.fetch(userId);

            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("✅ Du wurdest entbannt")
                        .setDescription(
                            `Du wurdest vom Server ${interaction.guild.name} entbannt!\n\n` +
                            `Grund: ${reason || 'Kein Grund'}\n\n` +
                            `Entbannt von: <@${moderator.id}>`
                        )
                        .setColor("#3cff00")
                ]
            });
        } catch (err) {
            console.log("DM FEHLER:", err.message);
        }

        const embed = new EmbedBuilder()
            .setTitle("🔓 User entbannt")
            .setDescription(
                `<@${userId}> wurde vom Server ${interaction.guild.name} entbannt!\n\n` +
                `Grund: ${reason || 'Kein Grund'}\n\n` +
                `Entbannt von: <@${moderator.id}>`
            )
            .setColor("#00ff00");

        await interaction.channel.send({ embeds: [embed] });

        const logChannel = await interaction.guild.channels.fetch(config.banLogChannelId).catch(() => null);
        if (logChannel) await logChannel.send({ embeds: [embed] });

        return interaction.editReply({ content: "✅ Entbannt" });
    }
};