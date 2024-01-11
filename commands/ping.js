const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("현재 디스코드 봇의 핑을 측정하고 출력합니다."),
  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp;

    const embed = new MessageEmbed()
      .setTitle("레생봇 핑")
      .setColor(0x00d8ff)
      .addFields({ name: "현재핑", value: `${ping}ms`, inline: true })
      .setTimestamp(new Date());

    await interaction.deferReply();
    await interaction.editReply({ embeds: [embed] });
    },
};
