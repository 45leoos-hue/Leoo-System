module.exports = {
    id: 'embed_cancel',

    async execute(interaction, client) {

        client.embedCache.delete(interaction.user.id);

        await interaction.update({
            content: '❌ Abgebrochen',
            embeds: [],
            components: []
        });
    }
};