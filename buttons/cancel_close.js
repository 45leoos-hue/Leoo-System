module.exports = {
    id: "cancel_close",

    async execute(interaction) {
        return interaction.reply({
            content: '❌ Vorgang abgebrochen.',
            ephemeral: true
        });
    }
};