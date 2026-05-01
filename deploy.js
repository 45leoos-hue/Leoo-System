require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// ======================
// 💥COMMANDS
// ======================

const commands = [
    new SlashCommandBuilder()   //TEAMJOIN 
        .setName('teamjoin')
        .setDescription('Team beitreten')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user')
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
            option.setName('grußrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)),
    
    new SlashCommandBuilder()   //TEAMKICK
        .setName('teamkick')
        .setDescription('Entfernt einen User aus einem Team')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grußrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)),
        
    new SlashCommandBuilder()   //UPRANK
        .setName('uprank')
        .setDescription('Gibt einem User eine Rolle')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('alte_rolle')
                .setDescription('Alte Rolle')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('neue_rolle')
                .setDescription('Neue Rolle')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grußrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)),        

    new SlashCommandBuilder()   //DERANK
        .setName('derank')
        .setDescription('Entfernt eine Rolle')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('alte_rolle')
                .setDescription('Alte Rolle')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('neue_rolle')
                .setDescription('Neue Rolle')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Grund')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grußrolle')
                .setDescription('Gruß Rolle')
                .setRequired(true)),          

    new SlashCommandBuilder() //TEAMLISTE
        .setName('teamliste')
        .setDescription('Zeigt die Teamliste an'),

    new SlashCommandBuilder()   //BAN COMMAND
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Der User')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('grund')
            .setDescription('Grund')
            .setRequired(true)),

    new SlashCommandBuilder()   //UNBAN COMMAND
    .setName('unban')
    .setDescription('Entbannt einen User vom Server')
    .addStringOption(option =>
        option.setName('userid')
            .setDescription('User ID')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('grund')
            .setDescription('Grund')
            .setRequired(true)),
        

    ].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('🔄 Registriere Commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('✅ Commands registriert!');
    } catch (error) {
        console.error(error);
    }
})();
