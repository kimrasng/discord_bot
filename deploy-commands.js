const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

const commands = commandFiles.map((file) => {
  const command = require(`./commands/${file}`);
  return command.data.toJSON();
});

const rest = new REST({ version: "9" }).setToken(token);

async function deleteCommands(existingCommandIds) {
  const commandsToDelete = existingCommandIds.filter((commandId) => !commands.includes(commandId));

  if (commandsToDelete.length > 0) {
    await Promise.all(commandsToDelete.map((commandId) =>
      rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
        .then(() => console.log(`명령어 ${commandId} 삭제됨.`))
        .catch(console.error)
    ));
  }
}

async function deployCommands() {
  try {
    const [existingCommands, _] = await Promise.all([
      rest.get(Routes.applicationGuildCommands(clientId, guildId)).then((response) => response.map((command) => command.id)).catch(console.error),
      rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands }).then(() => console.log("명령어 등록/업데이트 완료")).catch(console.error)
    ]);

    await deleteCommands(existingCommands);

    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`글로벌 명령어 등록 성공`);
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
