require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const jokes = require("./jokes.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Slash command
const commands = [
  new SlashCommandBuilder()
    .setName("jokingverify")
    .setDescription("Test if the bot is working")
    .toJSON()
];

// Register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }

  sendDailyJoke();
});

// Daily joke
function getToday() {
  return new Date().toISOString().split("T")[0];
}

function sendDailyJoke() {
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) return;

  const joke =
    jokes[getToday()] ||
    Object.values(jokes)[Math.floor(Math.random() * Object.values(jokes).length)];

  channel.send(
    "😂 Daily Joke:\n\n" +
    joke +
    "\n\n---\n👤 Credit: @rynaxbro"
  );
}

// Slash interaction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "jokingverify") {
    const joke = Object.values(jokes)[
      Math.floor(Math.random() * Object.values(jokes).length)
    ];

    await interaction.reply(
      "😂 Joke Test:\n\n" +
      joke +
      "\n\n---\n👤 Credit: @rynaxbro"
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
