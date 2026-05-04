require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ======================
// COLLECTIONS
// ======================
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

// ======================
// COMMANDS LADEN
// ======================
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    }
}

// ======================
// EVENTS LADEN
// ======================
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// ======================
// BUTTONS LADEN (CLEAN)
// ======================
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(`./buttons/${file}`);

    if (button.id && button.execute) {
        client.buttons.set(button.id, button);
    }
}

// ======================
// SELECT MENUS LADEN (CLEAN)
// ======================
const selectMenusPath = path.join(__dirname, 'selectMenus');
const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

for (const file of selectMenuFiles) {
    const menu = require(`./selectMenus/${file}`);

    if (menu.id && menu.execute) {
        client.selectMenus.set(menu.id, menu);
    }
}

// ======================
// CRASH SCHUTZ
// ======================
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// ======================
// LOGIN
// ======================
client.login(process.env.DISCORD_BOT_TOKEN);

