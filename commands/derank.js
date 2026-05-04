const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

// ======================
// 📌 SLASH COMMAND EXPORT
// ======================
module.exports.data = new SlashCommandBuilder()   //DERANK
    .setName('derank')
    .setDescription('Entfernt eine Rolle')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('User auswählen')
            .setRequired(true))
    .addRoleOption(option =>
        option.setName('alte_rolle')
            .setDescription('Alte Rolle')
            .setRequired(true))
    .addRoleOption(option =>
        option.setName('neue_rolle')
            .setDescription('Neue Rolle')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('grund')
            .setDescription('Grund')
            .setRequired(true))
    .addRoleOption(option =>
        option.setName('grußrolle')
            .setDescription('Gruß Rolle')
            .setRequired(true));

// ======================
// ⬇️ COMMAND LOGIK
// ======================
module.exports.execute = async (interaction, client, config) => {

    await interaction.deferReply();

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!config || !config.teamAllowedRoleId) {
        return interaction.editReply({
            content: "❌ teamAllowedRoleId fehlt!"
        });
    }

    if (!member.roles.cache.has(config.teamAllowedRoleId)) {
        return interaction.editReply({
            content: "❌ Du hast keine Berechtigung für diesen Command!"
        });
    }

    try {

        const user = interaction.options.getUser('user');
        const oldRole = interaction.options.getRole('alte_rolle');
        const newRole = interaction.options.getRole('neue_rolle');
        const reason = interaction.options.getString('grund');
        const grussrolle = interaction.options.getRole('grußrolle');

        const pfeiluntenEmoji = '<:pfeilunten2:1500455605788217354>';

        if (!user || !oldRole || !newRole) {
            return interaction.editReply({
                content: "❌ User oder Rollen fehlen!"
            });
        }

        const target = await interaction.guild.members.fetch(user.id);

        if (!target.roles.cache.has(oldRole.id)) {
            return interaction.editReply({
                content: "❌ User hat die ausgewählte alte Rolle nicht!"
            });
        }

        if (target.roles.cache.has(newRole.id)) {
            return interaction.editReply({
                content: "❌ User hat die neue Rolle bereits!"
            });
        }

        await target.roles.remove(oldRole);
        await target.roles.add(newRole);

        const embed = new EmbedBuilder()
            .setDescription(
                `## ${pfeiluntenEmoji} Derank!\n\n\n ` +

                `**Hiermit bekommt <@${user.id}> seinen Derank.**\n\n` +
                `**Von:** <@&${oldRole.id}>\n **Auf:** <@&${newRole.id}>\n\n` +
                `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                `**Mit freundlichen Grüßen,**` +
                (grussrolle ? `\n<@&${grussrolle.id}>` : '')
            )
            .setColor("#0020ff");

        await interaction.channel.send({ embeds: [embed] });

        return interaction.editReply({ content: '✅ Erfolgreich gesendet' });

    } catch (err) {
        console.error("DOWNRANK ERROR:", err);

        return interaction.editReply({
            content: "❌ Fehler beim Derank!"
        }).catch(() => {});
    }
};