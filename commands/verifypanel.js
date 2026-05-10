const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifypanel')
        .setDescription('Sendet das Verify Panel'),

    name: 'verifypanel',

    async execute(interaction, client, config) {

        await interaction.deferReply({ ephemeral: true });

        const button = new ButtonBuilder()
            .setCustomId('verify_btn')
            .setLabel('Klicke um zu Verifizieren')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setTitle('**<:haken1:1501921978028785685>  Verify System**')
            .setDescription(
                

                '** Willkommen auf 〨 | LEOO Settings** \n\n' +
                
                
                '<:schloss1:1501921620711964783> **Warum verifizieren?** \n' +
                '⚬ Zum Schutz vor Bots\n' +
                '⚬ Damit du alle Channels sehen kannst\n\n' +
                
                '<:doppelpfeilrechts:1501921595743014963> **Klicke unten zum verifizieren**'
            )    
            .setColor('#0020ff')
            .setImage('https://i.imgur.com/9AJYzUF_d.png?maxwidth=520&shape=thumb&fidelity=high')
            .setThumbnail('https://i.imgur.com/oov4GnX_d.png?maxwidth=520&shape=thumb&fidelity=high');

        const channel = interaction.guild.channels.cache.get(config.verifyChannelId);

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        return interaction.editReply({
            content: '✅ Verify Panel gesendet!'
        });
    }
};
