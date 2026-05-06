const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/roleWarnings.json');

// ⏱️ 3 Tage
const RESET_TIME = 3 * 24 * 60 * 60 * 1000;

// 🔥 MAX WARNS
const MAX_WARNS = 3;

function load() {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file));
}

function save(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {

    add(userId) {
        const data = load();

        // 👉 Array statt Zahl
        if (!data[userId]) data[userId] = [];

        const now = Date.now();

        // 👉 alte warns entfernen (wichtig für cap)
        data[userId] = data[userId].filter(t => now - t < RESET_TIME);

        // 👉 MAX CAP (NEU)
        if (data[userId].length < MAX_WARNS) {
            data[userId].push(now);
        }

        save(data);
        return data[userId].length;
    },

    get(userId) {
        const data = load();

        if (!data[userId]) return 0;

        const now = Date.now();

        // 👉 alte warns entfernen
        data[userId] = data[userId].filter(t => now - t < RESET_TIME);

        save(data);

        return data[userId].length;
    },

    reset(userId) {
        const data = load();
        delete data[userId];
        save(data);
    }
};