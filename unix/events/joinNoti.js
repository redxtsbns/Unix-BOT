// ./unix/commands/joinNotification.js
const axios = require("axios");
const path = require("path");

// Define backgrounds for the welcome message image (optional)
let backgrounds = [
  "https://example.com/background1.jpg",
  "https://example.com/background2.jpg",
  // Add more background URLs as needed
];

// Command configuration
module.exports.config = {
  name: "joinNotification",
  eventType: ["log:subscribe"], // Triggered when a user joins
  version: "1.0.0",
  description: "Welcomes new users with a customizable message and optionally an image.",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

// Updated joinNotification command
module.exports.run = async function ({ unix, event}) {
  try {
    logger(`Executing joinNotification command for event: ${JSON.stringify(event)}`);
    
    // Your command logic...

    // Test message to verify if the command is executed
    unix.send("Join notification command executed successfully.");
  } catch (error) {
    logger(`Error executing join notification command: ${error}`);
  }
};