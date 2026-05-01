// ======================
// 🔧 SETUP
// ======================
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// 🔥 CRASH SCHUTZ
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);


// ======================
// 📌 KONSTANTEN
// ======================
const teamRoles = [
    '1492679028132548679',
    '1492681437755867136',
    '1492681557054324746',
    '1492681697110790144',
    '1492891492719661188',
    '1494321701507301568',
    '1493256888031248554',
    '1492759773878423733',
    '1492759882158571621',
    '1492883079763595407',
    '1494230158088081478',
    '1494229353809182841',
    '1494229150750474291',
    '1492760321666973858',
    '1492760520892223588',
    '1492760642766241792',
    '1492760756280889466',
    '1494226207485722664',
    '1493696482015187024',
    '1492684606519120043'
];


// ======================
// 🧠 TEAMLISTE FUNKTION
// ======================
async function generateTeamEmbed(guild) {
    const allMembers = guild.members.cache;
    let description = '';

    for (const roleId of teamRoles) {
        const role = guild.roles.cache.get(roleId);
        if (!role) continue;

        const members = allMembers
            .filter(m => m.roles.cache.has(role.id))
            .map(m => `• <@${m.id}>`)
            .join('\n');

        description += `**<@&${role.id}>**\n`;
        description += members || '• *Keine Mitglieder*';
        description += '\n\n';
    }

    return new EmbedBuilder()
        .setColor('#023fb9')
        .setTitle('👥 Leoo Teamliste')
        .setImage('https://cdn.discordapp.com/attachments/1494369413724508260/1498722832526475405/ChatGPT_Image_28._Apr._2026_18_05_00.png')
        .setDescription(description || '❌ Keine Teams gefunden');
}


// ======================
// 🔁 AUTO UPDATE LOOP
// ======================
async function startAutoUpdate() {
    while (true) {
        try {
            const channel = await client.channels.fetch('1499115611861811342');
            const message = await channel.messages.fetch('1499431498896638092');

            const embed = await generateTeamEmbed(channel.guild);
            await message.edit({ embeds: [embed] });

            console.log("✅ Teamliste aktualisiert");

        } catch (err) {
            console.error("AUTO UPDATE ERROR:", err);
        }

        await new Promise(res => setTimeout(res, 60000));
    }
}


// ======================
// 🚀 READY EVENT
// ======================
client.once('clientReady', async () => {
    console.log(`✅ Bot online als ${client.user.tag}`);

    for (const guild of client.guilds.cache.values()) {
        await guild.members.fetch();
    }

    startAutoUpdate();
});


// ======================
// ⚡ COMMAND HANDLER
// ======================
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // 🔥 STOP falls schon verarbeitet
    if (interaction.replied || interaction.deferred) return;

    try {
        await interaction.deferReply({ flags: 64 });

        // ======================
        // 👥 TEAM JOIN
        // ======================
        if (interaction.commandName === 'teamjoin') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');

            // 🔥 mehrere Varianten absichern
            const grussrolle =
                interaction.options.getRole('grussrolle') ||
                interaction.options.getRole('grußrolle');

            const target = await interaction.guild.members.fetch(user.id);

            await target.roles.add(role);

            const embed = new EmbedBuilder()
                .setTitle("🔵 TEAMUPDATE 🔵")
                .setDescription(
                    `Hiermit tritt <@${user.id}> dem Team als <@&${role.id}> bei!\n\n` +
                    `**Wir wünschen dir viel Spaß im Team**\n\n` +
                    `Mit freundlichen Grüßen` +
                    (grussrolle ? `\n<@&${grussrolle.id}>` : '')
                )
                .setColor("#0020ff");

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
        }

        else if (interaction.commandName === 'teamleave') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('team');
            const target = await interaction.guild.members.fetch(user.id);

            if (!target.roles.cache.has(role.id)) {
                return interaction.editReply({
                    content: "❌ Dieser User ist nicht im Team."
                });
            }

            await target.roles.remove(role);

            const embed = new EmbedBuilder()
                .setTitle("🔵 TEAMUPDATE 🔵")
                .setDescription(
                    `Hiermit verlässt <@${user.id}> das Team <@&${role.id}>.\n\n` +
                    `Mit freundlichen Grüßen\n<@&1492883079763595407>`
                )
                .setColor("#0020ff");

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
        }

        else if (interaction.commandName === 'uprank') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const target = await interaction.guild.members.fetch(user.id);
            const botMember = interaction.guild.members.me;

            if (role.position >= botMember.roles.highest.position) {
                return interaction.editReply({
                    content: "❌ Rolle ist über meiner Bot-Rolle."
                });
            }

            if (!target.manageable) {
                return interaction.editReply({
                    content: "❌ Ich darf diesen User nicht bearbeiten."
                });
            }

            await target.roles.add(role);

            return interaction.editReply({
                content: `⬆️ ${user.tag} wurde hochgestuft (${role.name})`
            });
        }

        else if (interaction.commandName === 'downrank') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const target = await interaction.guild.members.fetch(user.id);

            if (!target.manageable) {
                return interaction.editReply({
                    content: "❌ Ich darf diesen User nicht bearbeiten."
                });
            }

            await target.roles.remove(role);

            return interaction.editReply({
                content: `⬇️ ${user.tag} wurde heruntergestuft (${role.name})`
            });
        }

        else if (interaction.commandName === 'teamliste') {

            const embed = await generateTeamEmbed(interaction.guild);

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Gesendet' });
        }

    } catch (err) {
        console.error("GLOBAL ERROR:", err);

        if (interaction.deferred || interaction.replied) {
            interaction.editReply({
                content: "❌ Fehler aufgetreten"
            }).catch(() => {});
        }
    }
});


// ======================
// 🔐 LOGIN
// ======================
client.login(process.env.DISCORD_BOT_TOKEN);
