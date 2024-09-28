import messages from "@/constants/messages.ts";
import { servers } from "@/models/server.ts";
import { CommandInteraction } from "discord.js";
import { createNowPlayingMessage } from "@/commands/collections/now-playing-msg.ts";

export const nowPlaying = {
  name: "nowplaying",
  execute: async (interaction: CommandInteraction): Promise<void> => {
    console.log("🚀 ===== interaction:", interaction);
    await interaction.deferReply();
    const server = servers.get(interaction.guildId as string);
    if (!server) {
      await interaction.followUp(messages.joinVoiceChannel);
      return;
    }
    if (!server.playing) {
      await interaction.followUp(messages.notPlaying);
      return;
    }
    const playing = server.playing;
    const message = createNowPlayingMessage({
      title: playing.song.title,
      author: playing.song.author,
      thumbnail: playing.song.thumbnail,
      url: playing.song.url,
      length: playing.song.length,
      platform: playing.song.platform,
      requester: playing.requester,
    });
    await interaction.followUp({
      embeds: [message],
    });
  },
};
