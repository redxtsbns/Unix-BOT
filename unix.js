const logger = require('./unix-utils/index.js')
const fs = require('fs');
const login = require("./fca/index.js")
const crypto = require('crypto');
const path = require('path')


const commands = {};
const noPrefixCommands = [];

function loadCommands() {
  fs.readdirSync('./unix/commands').filter(file => file.endsWith('.js')).forEach(file => {
    const command = require(`./unix/commands/${file}`);
    if (command.config.needPrefix === undefined) {
      noPrefixCommands.push(command);
      logger("⌞ 𝚄𝙽𝙸𝚇 ⌝ » 𝙽𝙾 needPrefix | " + file);
    } else {
      commands[command.config.name] = command;
      logger(`⌞ 𝚄𝙽𝙸𝚇 ⌝ » ${command.config.name} 𝙻𝙾𝙰𝙳𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈!`);
    }
  });
}

global.bot = JSON.parse(fs.readFileSync('config.json', 'utf8'))
logger("              █░█ █▄░█ █ ▀▄▀")
logger("              █▄█ █░▀█ █ █░█")
logger("╔═══════════════ ≪ 𝚄𝙽𝙸𝚇 ≫ ═══════════════╗")
logger("                  𝙲𝙾𝙽𝙵𝙸𝙶")
logger("𝙿𝚛𝚎𝚏𝚒𝚡: " + global.bot.prefix)
logger("𝙰𝚍𝚖𝚒𝚗𝚜: " + global.bot.admins)
logger("")
logger("——————————————————————————————————————————")
logger("                 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂")
logger("")
loadCommands()
logger("")
logger("—————————————————————————————————————————")
logger("                  𝙻𝙾𝙶𝙸𝙽")
logger("")
if (!fs.existsSync("Unixstate.json")) {
  logger("⌞ 𝚄𝙽𝙸𝚇 ⌝ » 𝙽𝙾 𝚄𝙽𝙸𝚇𝚂𝚃𝙰𝚃𝙴 𝙵𝙾𝚄𝙽𝙳.")
}
login({appState: JSON.parse(fs.readFileSync("./Unixstate.json"))}, (err, api) => {
  if (err) return logger(err);

  api.listenMqtt((err, event) => {
    if (err) return logger(err);
    if (event.body) {
      logger("⌞ 𝙴𝚅𝙴𝙽𝚃 ⌝ » " + event.body + " | " + event.threadID);
      handleCommand(event, api);
    }
  });

  logger("╚═══════════════ ≪ 𝚄𝙽𝙸𝚇 ≫ ══════════════╝");
});

function handleCommand(event, api) {
  const message = event.body.trim();
  
  // Check if the message is a prefixed command
  if (message.startsWith(global.bot.prefix)) {
    const args = message.slice(global.bot.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands[commandName];

    if (command) {
      const unix = {
        send: function(msg) {
          api.sendMessage(msg, event.threadID, event.messageID);
        },
        reply: function(msg) {
          api.sendMessage(msg, event.messageID);
        }
      };

      try {
        command.run({unix, event, args});
      } catch (error) {
        logger(`⌞ 𝙴𝚁𝚁𝙾𝚁 ⌝ » Error executing command ${commandName}: ${error.message}`);
      }
      return;
    }
  }

  // Check if the message matches any non-prefixed commands
  for (const command of noPrefixCommands) {
    if (message.toLowerCase().startsWith(command.config.name.toLowerCase())) {
      const args = message.split(/ +/).slice(1); // Get the arguments after the command name
      const unix = {
        send: function(msg) {
          api.sendMessage(msg, event.threadID, event.messageID);
        },
        reply: function(msg) {
          api.sendMessage(msg, event.messageID);
        }
      };

      try {
        command.run({unix, event, args});
      } catch (error) {
        logger(`⌞ 𝙴𝚁𝚁𝙾𝚁 ⌝ » Error executing command ${command.config.name}: ${error.message}`);
      }
      return;
    }
  }
}