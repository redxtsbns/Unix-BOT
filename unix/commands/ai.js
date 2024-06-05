module.exports.config = {
  name: "ping",
  needPrefix: true,
  description: "reply with pong!"
}
module.exports.run = function({unix, event, args}) {
  unix.send('pong!')
}