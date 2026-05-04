const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teamjoin')
        .setDescription('Team beitreten')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Team Rolle')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grussrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)
        ),

    async execute(interaction, client, config) {

        // 🔒 FIX: Permission Check (WICHTIG)
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.roles.cache.has(config.teamAllowedRoleId)) {
            return interaction.reply({
                content: "❌ Du hast keine Berechtigung für diesen Command!",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');                                           
        const role = interaction.options.getRole('role');
        const reason = interaction.options.getString('grund');
        const grussrolle = interaction.options.getRole('grussrolle');
        const hakenEmoji = '<:haken2:1500455562498801824>';
        const kreutzEmoji = '<:kreutz2:1500455722821881856>';
        const pfeilobenEmoji = '<:pfeiloben2:1500455655830720532>';
        const pfeiluntenEmoji = '<:pfeilunten2:1500455605788217354>';

        await interaction.reply({
            content: '✅ Erfolgreich gesendet',
            ephemeral: true
        });

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.roles.add(role);

            const embed = new EmbedBuilder()
                .setDescription(
                    `## ${hakenEmoji} Teambeitritt\n\n\n ` +
                    
                    `**Hiermit tritt <@${user.id}> dem Team als <@&${role.id}> bei!**\n\n` +
                    `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                    `**Mit freundlichen Grüßen,**` +
                    (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
                )
                .setColor('#0020ff');

            await interaction.channel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error('TEAMJOIN ERROR:', err);
        }
    }
};