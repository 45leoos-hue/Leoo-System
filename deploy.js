require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('teamjoin')
        .setDescription('Team beitreten')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User auswählen')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rolle auswählen')
                .setRequired(true)),
        

    new SlashCommandBuilder()
        .setName('leaveteam')
        .setDescription('Verlasse ein Team')
        .addRoleOption(option =>
            option.setName('team')
                .setDescription('Wähle ein Team')
                .setRequired(true)),

    new SlashCommandBuilder()
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

    new SlashCommandBuilder()
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