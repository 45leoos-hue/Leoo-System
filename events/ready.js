const startAutoUpdate = require('../utils/autoUpdate');

module.exports = {
    name: 'clientReady',
    once: true,

    async execute(client) {
        console.log(`✅ Bot ist online als ${client.user.tag}`);

        startAutoUpdate(client);
    }
};