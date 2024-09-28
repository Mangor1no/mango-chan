import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "../config.json" assert { type: "json" };
import { bootstrap } from "./commands/index.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(config.token);

bootstrap(client);
