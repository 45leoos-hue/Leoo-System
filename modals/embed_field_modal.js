const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'embed_field_modal',

    async execute(interaction, client) {

        const name = interaction.fields.getTextInputValue('name');
        const value = interaction.fields.getTextInputValue('value');

        let embed = client.embedCache.get(interaction.user.id) || new EmbedBuilder();

        embed.addFields({ name, value });

        client.embedCache.set(interaction.user.id, embed);

        await interaction.reply({
            content: '✅ Field hinzugefügt',
            embeds: [embed],
            ephemeral: true
        });
    }
};