const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("날짜")
        .setDescription("오늘의 날짜, 요일, 현재 시간 정보를 출력합니다."),
    async execute(interaction) {
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString();
        const day = currentDate.toLocaleDateString("ko-KR", { weekday: "long" });
        const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const embed = new MessageEmbed()
            .setTitle("오늘의 날짜 및 현제 시각")
            .setColor(0x00d8ff)
            .addFields(
                { name: "날짜", value: date, inline: true },
                { name: "요일", value: day, inline: true },
                { name: "현재 시간", value: time, inline: true }
            );

        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed] });
    },
};