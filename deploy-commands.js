const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = commandFiles.map((file) => {
  const command = require(`./commands/${file}`);
  return command.data.toJSON();
});

const rest = new REST({ version: "9" }).setToken(token);

const existingCommands = rest
  .get(Routes.applicationGuildCommands(clientId, guildId))
  .then((response) => response.map((command) => command.id))
  .catch(console.error);

Promise.all([existingCommands, commands])
  .then(([existingCommandIds, newCommandNames]) => {
    const commandsToDelete = existingCommandIds.filter(
      (commandId) => !newCommandNames.includes(commandId)
    );

    if (commandsToDelete.length > 0) {
      return Promise.all(
        commandsToDelete.map((commandId) =>
          rest
            .delete(
              Routes.applicationGuildCommand(clientId, guildId, commandId)
            )
            .then(() => console.log(`명령어 ${commandId} 삭제됨.`))
            .catch(console.error)
            )
            );
    }
  })
  .then(() => {
    return rest
      .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      .then(() => console.log("명령어 등록/업데이트 완료"))
      .catch(console.error);
  })
  .catch(console.error);
