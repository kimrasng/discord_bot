const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Array of status messages
const statusMessages = ["/help로 명령어확인", "열심히 대답"];

client.once("ready", () => {
  console.log("서버 준비 완료!");
  
  //deploy-commands.js 자동시작
  require('./deploy-commands.js');
  
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * statusMessages.length);
    const newStatus = statusMessages[randomIndex];
    client.user.setActivity(newStatus);
  }, 6000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
