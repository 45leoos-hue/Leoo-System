const generateTeamEmbed = require('./generateTeamEmbed');

async function startAutoUpdate(client) {
    while (true) {
        try {

            const channel = await client.channels.fetch('1499115611861811342');
            const message = await channel.messages.fetch('1499431498896638092');

            const embed = await generateTeamEmbed(channel.guild);
            await message.edit({ embeds: [embed] });

            console.log("✅ Teamliste wurde aktualisiert");

        } catch (err) {
            console.error("AUTO UPDATE ERROR:", err);
        }

        await new Promise(res => setTimeout(res, 60000));
    }
}

module.exports = startAutoUpdate;