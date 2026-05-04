const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

// ======================
// 📌 SLASH COMMAND EXPORT
// ======================
module.exports.data = new SlashCommandBuilder()   //UPRANK
    .setName('uprank')
    .setDescription('Gibt einem User eine Rolle')
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
// ⬆️ COMMAND LOGIK
// ======================
module.exports.execute = async (interaction, client, config) => {

    const member = await interaction.guild.members.fetch(interaction.user.id);

    // 🔧 FIX: sichere Config-Prüfung
    if (!config?.teamAllowedRoleId) {
        return interaction.reply({
            content: "❌ Config fehlt oder ist falsch geladen!",
            ephemeral: true
        });
    }

    // 🔒 FIX: Berechtigungscheck stabilisiert
    if (!member.roles.cache.has(config.teamAllowedRoleId)) {
        return interaction.reply({
            content: "❌ Du hast keine Berechtigung für diesen Command!",
            ephemeral: true
        });
    }

    const user = interaction.options.getUser('user');
    const oldRole = interaction.options.getRole('alte_rolle');
    const newRole = interaction.options.getRole('neue_rolle');
    const reason = interaction.options.getString('grund');
    const grussrolle = interaction.options.getRole('grußrolle');
    const hakenEmoji = '<:haken2:1500455562498801824>';
    const kreutzEmoji = '<:kreutz2:1500455722821881856>';
    const pfeilobenEmoji = '<:pfeiloben2:1500455655830720532>';
    const pfeiluntenEmoji = '<:pfeilunten2:1500455605788217354>';

    if (!user || !oldRole || !newRole) {
        return interaction.reply({
            content: "❌ User oder Rollen fehlen!",
            ephemeral: true
        });
    }

    const target = await interaction.guild.members.fetch(user.id);

    if (!target.roles.cache.has(oldRole.id)) {
        return interaction.reply({
            content: "❌ User hat die alte Rolle nicht!",
            ephemeral: true
        });
    }

    await target.roles.remove(oldRole);
    await target.roles.add(newRole);

    const embed = new EmbedBuilder()
        .setDescription(
            `## ${pfeilobenEmoji} Uprank! \n\n\n` +

            `**Hiermit bekommt <@${user.id}> seinen Uprank.**\n\n` +
            `**Von:** <@&${oldRole.id}>\n **Auf:** <@&${newRole.id}>\n\n` +
            `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
            `**Mit freundlichen Grüßen,**` +
            (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
        )
        .setColor("#0020ff");

    await interaction.channel.send({ embeds: [embed] });

    return interaction.reply({ content: '✅ Erfolgreich gesendet', ephemeral: true });
};