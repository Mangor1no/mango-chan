import { createPlayMessage } from "@/commands/messages/play.ts";
import {
  useMainPlayer
} from "discord-player";
import {
  ButtonInteraction,
  GuildMember
} from "discord.js";

export const playYt = {
  name: "play",
  execute: async (interaction: ButtonInteraction): Promise<void> => {
    await interaction.deferReply();

    try {
      const member = interaction.member as GuildMember; // Cast to GuildMember
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        return void interaction.followUp({
          content: `❌ | You need to stay in a voice channel to play music!`,
        });
      }

      const songUrl = interaction.customId.split("_")[1] ?? "";
      console.log("🚀 ===== interaction:", interaction);

      if (!voiceChannel) {
        return void interaction.followUp({
          content: "You need to be in a voice channel to play music!",
          ephemeral: true,
        });
      }

      // // Play the selected song
      const player = useMainPlayer();

      const track = await player.search(songUrl, {
        requestedBy: interaction.user.displayName,
      });

      if (!track) {
        return void interaction.followUp({
          content: "❌ | Could not find the track!",
        });
      }

      // @ts-expect-error type error of library
      const result = await player.play(voiceChannel, track);

      await interaction.followUp({
        content: `🔊 | Now playing: **${result.track.title} - ${result.track.author}**...`,
        ephemeral: true,
        embeds: [
          createPlayMessage({
            author: result.track.author,
            title: result.track.title,
            thumbnail: result.track.thumbnail,
            type: "Song",
            url: result.track.url,
            requester: interaction.user.username,
            duration: result.track.durationMS,
          }),
        ],
      });
    } catch (error) {
      console.error(error);
      return void interaction.followUp({
        content: "❌ | Could not play the track!",
      });
    }
  },
};
