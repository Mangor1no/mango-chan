import messages from "@/constants/messages.ts";
import { servers } from "@/models/server.ts";
import { AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";

export const resume = {
  name: "resume",
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();
    const server = servers.get(interaction.guildId as string);
    if (!server) {
      await interaction.followUp(messages.joinVoiceChannel);
      return;
    }
    if (server.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      server.audioPlayer.unpause();
      await interaction.followUp(messages.resumed);
      return;
    }
    await interaction.followUp(messages.notPlaying);
  },
};
