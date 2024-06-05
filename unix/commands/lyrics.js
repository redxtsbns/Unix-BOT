module.exports.config = {
  name: "lyrics",
  needPrefix: true,
  description: "Get lyrics for a song."
}
const axios = require('axios')
module.exports.run = function({unix, args}) {
  const query = args.join(" ");
  if (!query) {
    unix.send("Please provide a song name.")
  } else {
    axios.get("https://deku-rest-api-3ijr.onrender.com/search/lyrics?q=" + query)
    .then(response => {
      unix.send("Title: " + query + "\n\n" + response.data.result.lyrics)
    })
  }
}