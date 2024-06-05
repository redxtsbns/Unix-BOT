const axios = require('axios')
module.exports.config = {
  name: "ai",
  needPrefix: true,
  description: "Chat with AI"
}
module.exports.run = function({unix, event, args}) {
  const qu = args.join(" ")
  if (!qu) { 
    unix.send('Please provide a message.')
  } else {
    axios.get("https://deku-rest-api-3ijr.onrender.com/gpt4?prompt=" + qu + "&uid=20093") 
    .then(res => {
      unix.send("𝙰𝙸 𝚂𝙰𝚈𝚂: \n" +res.data.gpt4 + "\n\n𝙰𝙿𝙸 𝚄𝚂𝙴𝙳: 𝙳𝙴𝙺𝚄-𝚁𝙴𝚂𝚃-𝙰𝙿𝙸")
  })
    .catch(err => {
        unix.send("There's an issue when processing your request.")
  })
  }
}