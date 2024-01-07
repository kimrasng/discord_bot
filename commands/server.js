const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("서버")
        .setDescription("현재 서버의 정보를 출력합니다."),
    async execute(interaction) {
        const guildName = interaction.guild.name || "서버가 없습니다!";
        const memberCount = interaction.guild.memberCount || 0;
        const icon = interaction.guild.iconURL({ dynamic: true }) || "https://i1.sndcdn.com/artworks-EAKnzz7cwURCh6yz-cxPBQw-t500x500.jpg";

        const embed = new MessageEmbed()
            .setTitle("서버 정보")
            .setThumbnail(icon) 
            .addFields(
                { name: "서버이름", value: guildName },
                { name: "유저 수", value: memberCount.toString() },
                );

        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed] });
    }
};
