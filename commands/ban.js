const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

// ======================
// 📌 SLASH COMMAND EXPORT
// ======================
module.exports.data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Der User')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('grund')
            .setDescription('Grund')
            .setRequired(true));

// ======================
// 🔨 BAN COMMAND
// ======================
module.exports.execute = async (interaction, client, config) => {

    await interaction.deferReply({ ephemeral: true }); // 🔥 WICHTIG

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(config.banAllowedRoleId)) {
        return interaction.editReply({ content: "❌ Keine Berechtigung!" });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('grund');
    const moderator = interaction.user;

    if (!user) {
        return interaction.editReply({ content: "❌ User fehlt!" });
    }

    let target = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!target) {
        return interaction.editReply({ content: "❌ User nicht gefunden!" });
    }

    try {
        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🚫 Du wurdest gebannt")
                    .setDescription(
                        `Du wurdest vom Server ${interaction.guild.name} gebannt!\n\n` +
                        `Grund: ${reason || 'Kein Grund'}\n\n` +
                        `Gebannt von: <@${moderator.id}>`
                    )
                    .setColor("#ff0000")
            ]
        });
    } catch {}

    await target.ban({ reason: reason || 'Kein Grund' });

    const embed = new EmbedBuilder()
        .setTitle("🔨 User gebannt")
        .setDescription(
            `<@${user.id}> wurde vom Server ${interaction.guild.name} gebannt!\n\n` +
            `Grund: ${reason || 'Kein Grund'}\n\n` +
            `Gebannt von: <@${moderator.id}>`
        )
        .setColor("#ff0000");

    await interaction.channel.send({ embeds: [embed] });

    const logChannel = await interaction.guild.channels.fetch(config.banLogChannelId).catch(() => null);
    if (logChannel) await logChannel.send({ embeds: [embed] });

    return interaction.editReply({ content: "✅ Gebannt" });
};