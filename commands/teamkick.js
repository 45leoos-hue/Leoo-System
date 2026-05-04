const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teamkick')
        .setDescription('Entfernt einen User aus einem Team')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grußrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)
        ),

    async execute(interaction, client, config) {

        await interaction.deferReply();

        // 🔒 FIX: Permission Check hinzugefügt
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!config.teamAllowedRoleId || !member.roles.cache.has(config.teamAllowedRoleId)) {
            return interaction.editReply({
                content: "❌ Du hast keine Berechtigung für diesen Command!",
                flags: MessageFlags.Ephemeral
            });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('grund');
        const grussrolle = interaction.options.getRole('grußrolle');
        const hakenEmoji = '<:haken2:1500455562498801824>';
        const kreutzEmoji = '<:kreutz2:1500455722821881856>';
        const pfeilobenEmoji = '<:pfeiloben2:1500455655830720532>';
        const pfeiluntenEmoji = '<:pfeilunten2:1500455605788217354>';

        const teamRoleId = "1493696482015187024";
        const teamRole = interaction.guild.roles.cache.get(teamRoleId);

        if (!user) {
            return interaction.editReply({
                content: '❌ User fehlt!',
                flags: MessageFlags.Ephemeral
            });
        }

        let target;
        try {
            target = await interaction.guild.members.fetch(user.id);

            if (!target.roles.cache.has(teamRoleId)) {
                return interaction.editReply({
                    content: "❌ Dieser User ist nicht im Team!",
                    flags: MessageFlags.Ephemeral
                });
            }

            await target.roles.remove(teamRole);

        } catch (err) {
            console.error("ROLE ERROR:", err);
        }

        const embed = new EmbedBuilder()
            .setDescription(
                `## ${kreutzEmoji} Team Kick\n\n\n ` +
                
                `**Hiermit bekommt <@${user.id}> seinen Teamkick.**\n\n` +
                `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                `**Mit freundlichen Grüßen,**` +
                (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
            )
            .setColor("#0020ff");

        await interaction.channel.send({ embeds: [embed] });

        return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
    }
};