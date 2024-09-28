import { Client } from "discord.js";
import { schema } from "../schema/index.ts";

export const deploy = (client: Client): void => {
  try {
    client.on("messageCreate", async (message) => {
      if (message.author.bot || !message.guild) return;
      if (!client.application?.owner) await client.application?.fetch();

      if (
        message.content === "!deploy" &&
        message.author.id === client.application?.owner?.id
      ) {
        try {
          await message.guild.commands.set(schema);
          await message.reply("Deployed!");
        } catch (e) {
          message.reply("Fail to deploy!");
        }
      }
    });
  } catch (error) {
    console.log("🚀 ===== deploy error:", error);
  }
};
