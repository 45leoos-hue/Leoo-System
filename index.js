require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
    console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.member;

    // JOIN TEAM
    if (interaction.commandName === 'teamjoin') {

    await interaction.deferReply(); // 🔥 verhindert Timeout

    const member = interaction.member;
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    try {
        await member.roles.add(role);

        const embed = new EmbedBuilder()
            .setTitle("🔵 TEAMUPDATE 🔵")
            .setDescription(
                `Hiermit tritt ${user} dem Team als ${role} bei !\n\n` +
                `**Wir wünschen dir viel Spaß im Team**\n\n` +
                `Mit freundlichen Grüßen\n` +
                `<@&1492883079763595407>`
            )
            .setColor("#0020ff");

        return interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error(err);

        return interaction.editReply({
            content: "❌ Fehler beim Beitreten."
        });
    }
}

    // LEAVE TEAM
    if (interaction.commandName === 'leaveteam') {
        const role = interaction.options.getRole('team');

        await member.roles.remove(role);
        return interaction.reply(`❌ Du hast das Team **${role.name}** verlassen.`);
    }

    // UPRANK
    if (interaction.commandName === 'uprank') {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        const target = await interaction.guild.members.fetch(user.id);
        const botMember = interaction.guild.members.me;

        if (role.position >= botMember.roles.highest.position) {
            return interaction.reply("❌ Rolle ist über meiner Bot-Rolle.");
        }

        if (!target.manageable) {
            return interaction.reply("❌ Ich darf diesen User nicht bearbeiten.");
        }

        await target.roles.add(role);
        return interaction.reply(`⬆️ ${user.tag} wurde hochgestuft (${role.name})`);
    }

    // DOWNRANK
    if (interaction.commandName === 'downrank') {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        const target = await interaction.guild.members.fetch(user.id);

        if (!target.manageable) {
            return interaction.reply("❌ Ich darf diesen User nicht bearbeiten.");
        }

        await target.roles.remove(role);
        return interaction.reply(`⬇️ ${user.tag} wurde heruntergestuft (${role.name})`);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);