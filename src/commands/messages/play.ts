import messages from "@/constants/messages.ts";
import { formatSeconds } from "@/utils/index.ts";
import type { Track } from "discord-player";
import { type EmbedField, EmbedBuilder } from "discord.js";

export const createPlayMessage = (payload: {
  title: string;
  url: string;
  author: string;
  thumbnail: string;
  type: "Song" | "Playlist";
  duration: number;
  requester: string;
}): EmbedBuilder => {
  const author: EmbedField = {
    name: messages.author,
    value: payload.author,
    inline: true,
  };
  const duration: EmbedField = {
    name: messages.duration,
    value:
      payload.type === "Playlist"
        ? payload.duration.toString()
        : formatSeconds(payload.duration / 1000),
    inline: true,
  };
  return new EmbedBuilder()
    .setTitle(payload.title)
    .setURL(payload.url)
    .setAuthor({
      name: `${messages.addedToQueue} ${payload.requester}`,
    })
    .setImage(payload.thumbnail)
    .addFields(author, duration);
};

export const createSelectPlayMessage = ({ tracks }: { tracks: Track[] }) => {
  let tracksList = {
    name: "Pick your favourite one 🎶🎶🎶",
    value: "",
  };

  tracks.forEach((track, index) => {
    tracksList.value += `${index + 1}.  ${track.title} - ${track.author}\n`;
  });

  return new EmbedBuilder()
    .setTitle(`🥭 Mango-chan found these songs for you 🥭`)
    .addFields(tracksList);
};
