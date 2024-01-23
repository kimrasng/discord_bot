const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const statusMessages = ["/help로 명령어확인", "열심히 대답"];

client.once("ready", () => {
  console.log("서버 준비 완료!");

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * statusMessages.length);
    const newStatus = statusMessages[randomIndex];
    client.user.setActivity(newStatus);
  }, 6000);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  // Check if the message starts with the specified command prefix
  if (message.content.startsWith("/")) {
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists
    const command = client.commands.get(commandName);

    if (!command) return; // Command not found

    try {
      // Execute the command
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error while executing this command!");
    }
  }
});

client.login(token);
