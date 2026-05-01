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
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rolle auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('grußrolle')
                .setDescription('Rolle auswählen')
                .setRequired(true)),        
        
    new SlashCommandBuilder()   //TEAMLEAVE
        .setName('teamleave')
        .setDescription('Verlasse ein Team')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('team')
                .setDescription('Wähle ein Team')
                .setRequired(true)),

    new SlashCommandBuilder()   //UPRANK
        .setName('uprank')
        .setDescription('Gibt einem User eine Rolle')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rolle auswählen')
                .setRequired(true)),

    new SlashCommandBuilder()   //DERANK
        .setName('downrank')
        .setDescription('Entfernt eine Rolle')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rolle auswählen')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('teamliste')
        .setDescription('Zeigt die Teamliste an'),

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
