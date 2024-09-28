import { createHelpMessage } from "@/commands/collections/help-msg.ts";
import { CommandInteraction } from "discord.js";

export const help = {
  name: "help",
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();
    await interaction.followUp({
      embeds: [createHelpMessage()],
    });
  },
};
