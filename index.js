// ======================
// 🔧 SETUP
// ======================
require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField
} = require('discord.js');

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
const teamAllowedRoleId = '1492883325415850084';
const banAllowedRoleId = '1499776740669653073';
const banLogChannelId = '1499778326422753380';
const welcomeChannelId = '1499839976316211272';





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
        .setTitle('<:emoji1:1499846963070373888> Leoo Teamliste')
        .setImage('https://cdn.discordapp.com/attachments/1494369413724508260/1498722832526475405/ChatGPT_Image_28._Apr._2026_18_05_00.png')
        .setDescription(description || '❌ Keine Teams gefunden');
}



// ======================
// 🎉 WILLKOMMEN EVENT (NEU)
// ======================
client.on('guildMemberAdd', async member => {
    try {
        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('Sutana | Leoo Settings')
            .setDescription(
                `<:herz1:1499852268273537054> **Willkommen ${member} auf ${member.guild.name}**\n\n` +

                `| <:emoji1:1499846963070373888> **Memberanzahl:** ${member.guild.memberCount}\n` +
                `| <:regeln1:1499853243704938536> **Regeln:** <#1492714385666347109>\n` +
                `| <:haken1:1499859150681935982> **Verify:** <#1492722075612483684>\n\n\n` +
                
                
                '**Danke, dass du beigetreten bist!**' 
            
            
            )
            .setColor('#0020ff')
            .setImage('https://cdn.discordapp.com/attachments/1499848010950115430/1499863185249931495/Leoo_Welcome.png?ex=69f657f1&is=69f50671&hm=6fe82a57a17403af55a424322692a1d1916c3fd28024550b00087ec6b8090d08&')
            .setThumbnail(member.user.displayAvatarURL());

        await channel.send({ embeds: [embed] });

    } catch (err) {
        console.error("WELCOME ERROR:", err);
    }
});


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
    if (interaction.replied || interaction.deferred) return;

    try {
        await interaction.deferReply({ flags: 64 });

        // ======================
        // 👥 TEAM JOIN COMMAND
        // ======================
        if (interaction.commandName === 'teamjoin') {

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(teamAllowedRoleId)) {
                return interaction.editReply({
                    content: "❌ Du hast keine Berechtigung für diesen Command!"
                });
            }

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const reason = interaction.options.getString('grund');
            const grussrolle = interaction.options.getRole('grußrolle');

            if (!user || !role) {
                return interaction.editReply({
                    content: '❌ User oder Rolle fehlt!'
                });
            }

            let target;
            try {
                target = await interaction.guild.members.fetch(user.id);
                await target.roles.add(role);
            } catch (err) {
                console.error("ROLE ERROR:", err);
            }

            const embed = new EmbedBuilder()
                .setTitle("✅ Team Beitritt !")
                .setDescription(
                    `Hiermit tritt <@${user.id}> dem Team als <@&${role.id}> bei!\n\n` +
                    `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                    `**Wir wünschen dir viel Spaß im Team**\n\n` +
                    `Mit freundlichen Grüßen` +
                    (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
                )
                .setColor("#0020ff")
                .setImage('https://cdn.discordapp.com/attachments/1492794710266482750/1499876476735062128/2097C6E5-66BD-41A4-B56A-C4A582439332.png?ex=69f66452&is=69f512d2&hm=a4a8aad21ed7cdc43ad0fade2482a045f7b79111b9f92b911db34b9f5e0956f1&');

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
            }

        // ======================
        // 🚪 TEAM KICK COMMAND
        // ======================
        else if (interaction.commandName === 'teamkick') {

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(teamAllowedRoleId)) {
        return interaction.editReply({
            content: "❌ Du hast keine Berechtigung für diesen Command!"
        });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('grund');
    const grussrolle = interaction.options.getRole('grußrolle');

    const teamRoleId = "1493696482015187024";
    const teamRole = interaction.guild.roles.cache.get(teamRoleId); // ✅ HIER definieren

    if (!user) {
        return interaction.editReply({
            content: '❌ User fehlt!'
        });
    }

    let target;
    try {
        target = await interaction.guild.members.fetch(user.id);

        if (!target.roles.cache.has(teamRoleId)) {
            return interaction.editReply({
                content: "❌ Dieser User ist nicht im Team!"
            });
        }

        await target.roles.remove(teamRole); // ✅ richtige Rolle entfernen

    } catch (err) {
        console.error("ROLE ERROR:", err);
    }

    const embed = new EmbedBuilder()
        .setTitle("❌ Team Kick !")
        .setDescription(
            `Hiermit bekommt <@${user.id}> seinen Teamkick.\n\n` +
            `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
            `**Wir wünschen dir alles Gute**\n\n` +
            `Mit freundlichen Grüßen` +
            (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
        )
        .setColor("#0020ff")
        .setImage('https://cdn.discordapp.com/attachments/1492794710266482750/1499876902385746120/8DB043A5-81B2-495E-ABBA-C7B298292CA9.png?ex=69f664b7&is=69f51337&hm=808b8006c4102964edaca9c94ccc684276324c219ccddbc96791b07fb00a75a6&');

    await interaction.channel.send({ embeds: [embed] });

    return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
}

        // ======================
        // ⬆️ UPRANK COMMAND
        // ======================
        else if (interaction.commandName === 'uprank') {

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(teamAllowedRoleId)) {
                return interaction.editReply({
                    content: "❌ Du hast keine Berechtigung für diesen Command!"
                });
            }

            const user = interaction.options.getUser('user');
            const oldRole = interaction.options.getRole('alte_rolle');
            const newRole = interaction.options.getRole('neue_rolle');
            const reason = interaction.options.getString('grund');
            const grussrolle = interaction.options.getRole('grußrolle');

            if (!user || !oldRole || !newRole) {
                return interaction.editReply({
                    content: "❌ User oder Rollen fehlen!"
                });
            }

            const target = await interaction.guild.members.fetch(user.id);

            if (!target.roles.cache.has(oldRole.id)) {
                return interaction.editReply({
                    content: "❌ User hat die alte Rolle nicht!"
                });
            }

            await target.roles.remove(oldRole);
            await target.roles.add(newRole);

            const embed = new EmbedBuilder()
                .setTitle("⬆️ UPRANK !")
                .setDescription(
                    `Hiermit bekommt <@${user.id}> seinen Uprank.\n\n Von <@&${oldRole.id}> \n Auf <@&${newRole.id}> \n\n` +
                    `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                    `Mit freundlichen Grüßen` +
                    (grussrolle && grussrolle.id ? `\n<@&${grussrolle.id}>` : '')
                )
                .setColor("#0020ff")
                .setImage('https://cdn.discordapp.com/attachments/1492794710266482750/1499877316698832996/76565770-DEB1-4162-8E0F-6043329C1D20.png?ex=69f6651a&is=69f5139a&hm=055dd045cf07d3f1dbed8b88e7d648145a83b7c09faf4ced048457e3ff7b604d&');

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Erfolgreich gesendet' });
        }

        // ======================
        // ⬇️ DERANK COMMAND
        // ======================
        else if (interaction.commandName === 'derank') {

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(teamAllowedRoleId)) {
                return interaction.editReply({
                    content: "❌ Du hast keine Berechtigung für diesen Command!"
                });
            }

            try {

                const user = interaction.options.getUser('user');
                const oldRole = interaction.options.getRole('alte_rolle');
                const newRole = interaction.options.getRole('neue_rolle');
                const reason = interaction.options.getString('grund');
                const grussrolle = interaction.options.getRole('grußrolle');

                if (!user || !oldRole || !newRole) {
                    return interaction.editReply({
                        content: "❌ User oder Rollen fehlen!"
                    });
                }

                const target = await interaction.guild.members.fetch(user.id);

                if (!target.roles.cache.has(oldRole.id)) {
                    return interaction.editReply({
                        content: "❌ User hat die ausgewählte alte Rolle nicht!"
                    });
                }

                if (target.roles.cache.has(newRole.id)) {
                    return interaction.editReply({
                        content: "❌ User hat die neue Rolle bereits!"
                    });
                }

                await target.roles.remove(oldRole);
                await target.roles.add(newRole);

                const embed = new EmbedBuilder()
                    .setTitle("⬇️ DERANK !")
                    .setDescription(
                        `Hiermit bekommt <@${user.id}> seinen Derank. \n\n Von <@&${oldRole.id}> \n Auf <@&${newRole.id}> \n\n` +
                        `**Grund:** ${reason || 'Kein Grund angegeben'}\n\n` +
                        `Mit freundlichen Grüßen` +
                        (grussrolle ? `\n<@&${grussrolle.id}>` : '')
                    )
                    .setColor("#0020ff")
                    .setImage('https://cdn.discordapp.com/attachments/1492794710266482750/1499878590932717599/4DEFE6DD-1514-434B-8C04-018F1962EFC2.png?ex=69f6664a&is=69f514ca&hm=b6575654ddf183185ba3b442f49a7495a3c68b434bb93b224eff0c8ac3b2cc26&');

                await interaction.channel.send({ embeds: [embed] });

                return interaction.editReply({ content: '✅ Erfolgreich gesendet' });

            } catch (err) {
                console.error("DOWNRANK ERROR:", err);

                return interaction.editReply({
                    content: "❌ Fehler beim Derank!"
                }).catch(() => {});
            }
        }

        // ======================
        // 📋 TEAMLISTE COMMAND
        // ======================
        else if (interaction.commandName === 'teamliste') {

            const embed = await generateTeamEmbed(interaction.guild);

            await interaction.channel.send({ embeds: [embed] });

            return interaction.editReply({ content: '✅ Gesendet' });
        }

        // ======================
        // 🔨 BAN
        // ======================
        else if (interaction.commandName === 'ban') {

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(banAllowedRoleId)) {
                return interaction.editReply({ content: "❌ Keine Berechtigung!" });
            }

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('grund');
            const moderator = interaction.user;

            if (!user) {
                return interaction.editReply({ content: "❌ User fehlt!" });
            }

            let target = await interaction.guild.members.fetch(user.id);

            try {
                await user.send({
                    embeds: [new EmbedBuilder()
                        .setTitle("🚫 Du wurdest gebannt")
                        .setDescription(`Du wurdest vom Server ${interaction.guild.name} gebannt!\n\n` +
                                `Grund: ${reason || 'Kein Grund'}\n\n` +
                                `Gebannt von: <@${moderator.id}>`)
                        .setColor("#ff0000")]
                });
            } catch {}

            await target.ban({ reason: reason || 'Kein Grund' });

            const embed = new EmbedBuilder()
                .setTitle("🔨 User gebannt")
                .setDescription(`<@${user.id}> wurde vom Server ${interaction.guild.name} gebannt!\n\n` +
                                `Grund: ${reason || 'Kein Grund'}\n\n` +
                                `Gebannt von: <@${moderator.id}>`)
                .setColor("#ff0000");

            await interaction.channel.send({ embeds: [embed] });

            const logChannel = await interaction.guild.channels.fetch(banLogChannelId).catch(() => null);
            if (logChannel) await logChannel.send({ embeds: [embed] });

            return interaction.editReply({ content: "✅ Gebannt" });
        }

        // ======================
        // 🔓 UNBAN
        // ======================
        else if (interaction.commandName === 'unban') {

            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.has(banAllowedRoleId)) {
                return interaction.editReply({ content: "❌ Keine Berechtigung!" });
            }

            const userId = interaction.options.getString('userid');
            const reason = interaction.options.getString('grund');
            const moderator = interaction.user;

            if (!userId) {
                return interaction.editReply({ content: "❌ User ID fehlt!" });
            }

            await interaction.guild.members.unban(userId);

            try {
                const user = await client.users.fetch(userId);
                await user.send({
                    embeds: [new EmbedBuilder()
                        .setTitle("✅ Du wurdest entbannt")
                        .setDescription(`Du wurdest vom Server ${interaction.guild.name} entbannt!\n\n` +
                                `Grund: ${reason || 'Kein Grund'}\n\n` +
                                `Entbannt von: <@${moderator.id}>`)
                        .setColor("#3cff00")]
                });
            } catch (err) {
              console.log("DM FEHLER:", err.message);
      }

            const embed = new EmbedBuilder()
                .setTitle("🔓 User entbannt")
                .setDescription(`<@${userId}> wurde vom Server ${interaction.guild.name} entbannt!\n\n` +
                                `Grund: ${reason || 'Kein Grund'}\n\n` +
                                `Entbannt von: <@${moderator.id}>`)
                .setColor("#00ff00");

            await interaction.channel.send({ embeds: [embed] });

            const logChannel = await interaction.guild.channels.fetch(banLogChannelId).catch(() => null);
            if (logChannel) await logChannel.send({ embeds: [embed] });

            return interaction.editReply({ content: "✅ Entbannt" });
        
         }

    } catch (err) {
        console.error("COMMAND ERROR:", err);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: "❌ Fehler", ephemeral: true }).catch(() => {});
        } else {
            await interaction.editReply({ content: "❌ Fehler" }).catch(() => {});
        }
    }
});    
    
        




// ======================
// 🔐 LOGIN
// ======================
client.login(process.env.DISCORD_BOT_TOKEN); 
