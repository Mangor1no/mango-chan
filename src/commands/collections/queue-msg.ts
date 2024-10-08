import messages from "@/constants/messages.ts";
import { type QueueItem } from "@/models/server.ts";
import { formatSeconds } from "@/utils/index.ts";
import { EmbedBuilder } from "discord.js";

const MAX_SONGS_PER_PAGE = 10;

const generatePageMessage = (items: QueueItem[], start: number) => {
  const embedMessage = new EmbedBuilder({
    title: messages.yourQueue,
    fields: items.map((item, index) => ({
      name: `${start + 1 + index}. ${item.song.title} | ${item.song.author}`,
      value: `${formatSeconds(item.song.length)} | ${item.song.platform} | ${
        messages.addedToQueue
      } ${item.requester}`,
    })),
  });
  return embedMessage;
};

export const createQueueMessages = (queue: QueueItem[]): EmbedBuilder[] => {
  if (queue.length < MAX_SONGS_PER_PAGE) {
    const embedMessage = generatePageMessage(queue, 0);
    return [embedMessage];
  } else {
    const embedMessages = [];
    for (let i = 0; i < queue.length; i += MAX_SONGS_PER_PAGE) {
      const items = generatePageMessage(
        queue.slice(i, i + MAX_SONGS_PER_PAGE),
        i
      );
      embedMessages.push(items);
    }
    return embedMessages;
  }
};
