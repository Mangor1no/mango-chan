import { schema } from "@/commands/schema/index.ts";
import messages from "@/constants/messages.ts";
import {
  type BaseApplicationCommandOptionsData,
  EmbedBuilder,
} from "discord.js";

export const createHelpMessage = (): EmbedBuilder => {
  const embedMessage = new EmbedBuilder({
    title: messages.help,
    fields: (schema as BaseApplicationCommandOptionsData[]).map(
      (item, index) => ({
        name: `${index + 1}. ${item.name}`,
        value: `${item.description}`,
      })
    ),
  });
  return embedMessage;
};
