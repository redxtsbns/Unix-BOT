const fs = require('fs');
const login = require("./fca/index.js");
const logger = require('./unix-utils/index.js');
const path = require('path');
const commands = {};
global.noPrefixCommands = [];
global.commandList = [];

function loadCommands() {
  fs.readdirSync('./unix/commands/').filter(file => file.endsWith('.js')).forEach(file => {
    const command = require(`./unix/commands/${file}`);
    const event = require(`./unix/commands/${file}`)
    if (!command.config.needPrefix) {
      global.noPrefixCommands.push(command);
    } else {
      commands[command.config.name] = command;
      global.commandList.push(command.config);
      logger(`⌞ 𝚄𝙽𝙸𝚇 ⌝ » ${command.config.name} 𝙻𝙾𝙰𝙳𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈!`);
    }
  });
  logger("")

  logger("                 𝙴𝚅𝙴𝙽𝚃𝚂")
  logger("")
    fs.readdirSync('./unix/events/').filter(file => file.endsWith('.js')).forEach(file => {
    const events = require('./unix/events/' + file)
    logger("⌞ 𝚄𝙽𝙸𝚇 ⌝ » " + events.config.name + " 𝙴𝚅𝙴𝙽𝚃 𝙻𝙾𝙰𝙳𝙴𝙳")
  })
}

global.bot = JSON.parse(fs.readFileSync('config.json', 'utf8'));
logger("              █░█ █▄░█ █ ▀▄▀");
logger("              █▄█ █░▀█ █ █░█");
logger("╔═══════════════ ≪ 𝚄𝙽𝙸𝚇 ≫ ═══════════════╗");
logger("                  𝙲𝙾𝙽𝙵𝙸𝙶");
logger("𝙿𝚛𝚎𝚏𝚒𝚡: " + global.bot.prefix);
logger("𝙰𝚍𝚖𝚒𝚗𝚜: " + global.bot.admins);
logger("");
logger("——————————————————————————————————————————");
logger("                 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂");
logger("");
loadCommands();
logger("");
logger("—————————————————————————————————————————");
logger("                  𝙻𝙾𝙶𝙸𝙽");
logger("");

if (!fs.existsSync("Unixstate.json")) {
  logger("⌞ 𝚄𝙽𝙸𝚇 ⌝ » 𝙽𝙾 𝚄𝙽𝙸𝚇𝚂𝚃𝙰𝚃𝙴 𝙵𝙾𝚄𝙽𝙳.");
}

login({ appState: JSON.parse(fs.readFileSync("./Unixstate.json")) }, (err, api) => {
  if (err) return logger(err);

  api.listenMqtt((err, event) => {
    if (err) return logger(err);

    if (event.body) {
      logger("⌞ 𝙴𝚅𝙴𝙽𝚃 ⌝ » " + event.body + " | " + event.threadID);
      handleCommand(event, api);
    }

    if (event.logMessageType === "log:subscribe") {
      handleJoinEvent(event, api);
    }
  });

  logger("╚═══════════════ ≪ 𝚄𝙽𝙸𝚇 ≫ ══════════════╝");
});

// Updated handleJoinEvent function
