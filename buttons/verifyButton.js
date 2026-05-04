module.exports = {
    id: 'verify_btn',

    async execute(interaction, client, config) {

        try {
            await interaction.deferReply({ ephemeral: true });

            // Rollen holen aus config
            const unverifyRole = config.unverifyedRoleId;
            const verifyRole = config.verifyedRoleId;

            // Rollen tauschen
            await interaction.member.roles.remove(unverifyRole);
            await interaction.member.roles.add(verifyRole);

            return interaction.editReply({
                content: '✅ Du wurdest erfolgreich verifiziert!'
            });

        } catch (err) {
            console.error("VERIFY BUTTON ERROR:", err);

            return interaction.editReply({
                content: '❌ Fehler beim Verifizieren!'
            }).catch(() => {});
        }
    }
};