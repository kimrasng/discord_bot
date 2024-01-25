const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const { token, clientId, guildId } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const statusMessages = ["안녕하세요", "반가워요"];

client.once(Events.ClientReady, readyClient => {
  console.log(`디스코드봇 ${readyClient.user.tag}이 작동을 시작했습니다.`);

  require('./deploy-commands.js');

  setInterval(() => {
	const index = Math.floor(Math.random() * statusMessages.length);
	readyClient.user.setActivity(statusMessages[index], { type: 'PLAYING' });
  }, 10000);

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
