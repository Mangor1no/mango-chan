import { searchYt } from "@/commands/collections/search-yt.ts";
import messages from "@/constants/messages.ts";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { ButtonInteraction, Client } from "discord.js";
import { deploy } from "./collections/deploy.ts";
import { playYt } from "@/commands/collections/play-yt.ts";
export const bootstrap = (client: Client): void => {
  deploy(client);

  // @ts-expect-error type error of library
  const player = new Player(client);
  player.extractors.register(YoutubeiExtractor, {});

  // player.on("error", (queue, error) => {
  //   console.log(
  //     `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  //   );
  // });
  // player.on("connectionError", (queue, error) => {
  //   console.log(
  //     `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  //   );
  // });

  // player.on("trackStart", (queue, track) => {
  //   queue.metadata.send(
  //     `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
  //   );
  // });

  // player.on("trackAdd", (queue, track) => {
  //   queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
  // });

  // player.on("botDisconnect", (queue) => {
  //   queue.metadata.send(
  //     "❌ | I was manually disconnected from the voice channel, clearing queue!"
  //   );
  // });

  // player.on("channelEmpty", (queue) => {
  //   queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
  // });

  // player.on("queueEnd", (queue) => {
  //   queue.metadata.send("✅ | Queue finished!");
  // });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.guildId) return;
    if (interaction.isCommand()) {
      try {
        switch (interaction.commandName) {
          case "play":
            searchYt.execute(interaction);
            break;
        }
      } catch (e) {
        interaction.reply(messages.error);
      }
    }

    if (interaction.isButton()) {
      try {
        const buttonInteraction = interaction as ButtonInteraction; // Type assertion here

        if (buttonInteraction.customId.startsWith("play_")) {
          playYt.execute(buttonInteraction);
        }
      } catch (error) {
        interaction.reply(messages.error);
      }
    }
  });
};
