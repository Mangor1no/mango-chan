import { createSelectPlayMessage } from "@/commands/messages/play.ts";
import { truncateSongTitle } from "@/utils/index.ts";
import { useMainPlayer } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  type APIEmbed,
} from "discord.js";

export const searchYt = {
  name: "play",
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();

    try {
      // @ts-expect-error type error of library
      const voiceChannel = interaction.member?.voice?.channel;

      if (!voiceChannel) {
        return void interaction.followUp({
          content: `❌ | You need to stay in a voice channel to play music!`,
        });
      }

      const query = interaction.options.get("input")?.value as string;
      await interaction.followUp({
        content: `⏱ | Searching for **${query}**...`,
      });

      const player = useMainPlayer();

      const searchResult = await player.search(query, {
        requestedBy: interaction.user.username,
      });

      const results = searchResult.tracks.slice(0, 5);

      // Create buttons for each result
      const buttons = results.map((track, index) => {
        return new ButtonBuilder()
          .setCustomId(`play_${track.url}`)
          .setLabel(`${index + 1}`)
          .setStyle(ButtonStyle.Primary);
      });

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        buttons
      );

      // Send message with buttons
      await interaction.followUp({
        embeds: [createSelectPlayMessage({ tracks: results })],
        components: [buttonRow],
      });
    } catch (error) {
      console.error(error);
      return void interaction.followUp({
        content: "Could not join your voice channel!",
      });
    }
  },
};
