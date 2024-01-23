const { Client, Collection, Intents } = require("discord.js");
const { clientId, token } = require("./config.json");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const commands = client.commands.map(command => command.data.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const statusMessages = ["/help로 명령어확인", "열심히 대답"];

client.once("ready", () => {
  console.log("서버 준비 완료!");

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
