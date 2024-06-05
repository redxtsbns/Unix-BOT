// ./unix/commands/help.js
module.exports = {
  config: {
    name: 'help',
    description: 'Lists all available commands',
    needPrefix: true
  },
  run({unix, event, args}) {
    let message = "𝙷𝙴𝚁𝙴'𝚂 𝚃𝙷𝙴 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂(●’◡’●)ﾉ:\n\n";

    global.commandList.forEach(cmd => {
      message += `• ${cmd.name}: ${cmd.description}\n`;
    });

    global.noPrefixCommands.forEach(cmd => {
      message += `• ${cmd.config.name} (no prefix): ${cmd.config.description}\n`;
    });

    unix.send(message);
  }
}