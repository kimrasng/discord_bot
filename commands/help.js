const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("레생봇의 명령어를 출력합니다."),
    async execute(interaction){
        
        const embed= new MessageEmbed()
            .setTitle("명령어")
            .addFields(
              { name: "/help", value: "레생봇의 명령어를 출력합니다." },
              { name: "/서버", value: "현재 서버의 정보를 출력합니다." },
              { name: "/ping", value: "현재 봇의 핑을 측정하고 출력합니다." },
            );
        
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed] });
        
    },
};