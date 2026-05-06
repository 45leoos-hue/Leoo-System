module.exports = {
    id: 'embed_send',

    async execute(interaction, client) {

        const embed = client.embedCache.get(interaction.user.id);

        if (!embed) {
            return interaction.reply({
                content: '❌ Kein Embed vorhanden!',
                ephemeral: true
            });
        }

        await interaction.channel.send({
            embeds: [embed]
        });

        client.embedCache.delete(interaction.user.id);

        await interaction.reply({
            content: '✅ Embed gesendet!',
            ephemeral: true
        });
    }
};