const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'verify_btn',

    async execute(interaction, client, config) {

        try {
            await interaction.deferReply({ ephemeral: true });

            const unverifyRole = config.unverifyedRoleId;
            const verifyRole = config.verifyedRoleId;
            const logChannelId = config.verifyLogChannelId;

            await interaction.member.roles.remove(unverifyRole);
            await interaction.member.roles.add(verifyRole);

            const logChannel = interaction.guild.channels.cache.get(logChannelId);

            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Verifizierung")
                    .addFields(
                        { name: "User", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "ID", value: `${interaction.user.id}`, inline: true }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            }

            return interaction.editReply({
                content: '✅ Du wurdest erfolgreich verifiziert!'
            });

        } catch (err) {
            console.error("VERIFY BUTTON ERROR:", err);

            const logChannel = interaction.guild.channels.cache.get(config.verifyLogChannelId);

            if (logChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("❌ Verifizierungs Fehler")
                    .setDescription(`User: <@${interaction.user.id}> (${interaction.user.id})`)
                    .addFields({
                        name: "Fehler",
                        value: `\`\`\`${err.message}\`\`\``
                    })
                    .setTimestamp();

                logChannel.send({ embeds: [errorEmbed] }).catch(() => {});
            }

            return interaction.editReply({
                content: '❌ Fehler beim Verifizieren!'
            }).catch(() => {});
        }
    }
};
