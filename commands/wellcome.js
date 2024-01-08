const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("환영 메시지 설정")
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('환영 메시지를 출력할 채널을 선택하세요.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: "당신은 관리자가 아니기에 설정을 할수 없습니다.", ephemeral: true });
        }

        const newWelcomeChannelId = interaction.options.getChannel('channel').id;
        const printchannel = interaction.guild.channels.cache.get(newWelcomeChannelId);
        const icon = interaction.user.displayAvatarURL({ dynamic: true }) || "https://i1.sndcdn.com/artworks-EAKnzz7cwURCh6yz-cxPBQw-t500x500.jpg";

        const embed = new MessageEmbed()
            .setTitle("환영 메시지 설정 완료")
            .setDescription(`앞으로 환영 메시지는 ${printchannel}.`)
            .setColor("#2ecc71");

        await interaction.reply({ embeds: [embed] });
    },
    async sendWelcomeMessage(member, printchannel) {
        const icon = member.user.displayAvatarURL({ dynamic: true }) || "https://i1.sndcdn.com/artworks-EAKnzz7cwURCh6yz-cxPBQw-t500x500.jpg";

        const embed = new MessageEmbed()
            .setTitle(`${member.user.username}님 환영합니다!`)
            .setThumbnail(icon)
            .addFields(
                { name: "필드1", value: "값1" },
                { name: "필드2", value: "값2" }
            );

        printchannel.send({ embeds: [embed] });
    },
};

const client = require('your-discord-client-instance');
client.on('guildMemberAdd', (member) => {
    const newWelcomeChannelId = '123456789012345678';
    const printchannel = member.guild.channels.cache.get(newWelcomeChannelId);

    if (printchannel) {
        module.exports.sendWelcomeMessage(member, printchannel);
    } else {
        console.error(`채널 ${newWelcomeChannelId}는 찾을수 없습니다.`);
    }
});
