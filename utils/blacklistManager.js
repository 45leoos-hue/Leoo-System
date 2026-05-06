const fs = require('fs');
const file = './data/blacklist.json';

let cache;

function init() {
    if (!fs.existsSync('./data')) fs.mkdirSync('./data');

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({ users: [] }, null, 2));
    }

    cache = JSON.parse(fs.readFileSync(file));
}

function save() {
    fs.writeFileSync(file, JSON.stringify(cache, null, 2));
}

function getAll() {
    return cache.users;
}

function get(userId) {
    return cache.users.find(u => u.id === userId);
}

function add(userId, data) {
    if (get(userId)) return false;

    cache.users.push({
        id: userId,
        ...data
    });

    save();
    return true;
}

function remove(userId) {
    cache.users = cache.users.filter(u => u.id !== userId);
    save();
}

module.exports = { init, get, getAll, add, remove };