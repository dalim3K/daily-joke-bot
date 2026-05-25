require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const jokes = require("./jokes.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function sendJoke() {
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) return;

  const joke = jokes[getToday()] || "No joke today 😢";

  channel.send(
    "😂 Daily Joke:\n\n" +
    joke +
    "\n\n---\n👤 Credit: @rynaxbro"
  );
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  sendJoke();
  setInterval(sendJoke, 1000 * 60 * 60 * 24);
});

client.login(process.env.DISCORD_TOKEN);
