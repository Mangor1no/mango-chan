// youtube.ts
import {
  Platform,
  youtubePlaylistRegex,
  youtubeVideoRegex,
} from "@/constants/index.ts";
import ytdl from "ytdl-core";
import ytpl from "@distube/ytpl";
import ytsr, { type Video } from "@distube/ytsr";

function convertToSeconds(duration: string | null) {
  if (!duration) {
    throw new Error("No duration available");
  }

  const [hours, minutes, seconds] = duration.split(":").map(Number);

  if (!hours || !minutes || !seconds) {
    throw new Error("Invalid duration format");
  }

  // Calculate total seconds
  return hours * 3600 + minutes * 60 + seconds;
}

export class YoutubeService {
  public static async getVideoDetails(content: string): Promise<Song> {
    const parsedContent = content.match(youtubeVideoRegex);
    let id = "";
    if (!parsedContent) {
      const result = await this.searchVideo(content);
      if (!result) throw new Error();
      id = result;
    } else {
      id = parsedContent[1] as string;
    }
    const videoUrl = this.generateVideoUrl(id);
    const result = await ytdl.getInfo(videoUrl);
    return {
      title: result.videoDetails.title,
      length: parseInt(result.videoDetails.lengthSeconds, 10),
      author: result.videoDetails.author.name,
      thumbnail:
        result.videoDetails.thumbnails?.[
          result.videoDetails.thumbnails.length - 1
        ]?.url ?? "",
      url: videoUrl,
      platform: Platform.YOUTUBE,
    };
  }

  public static async getPlaylist(url: string): Promise<Playlist> {
    const id = url.split("?")?.[1]?.split("=")?.[1] ?? "";
    const playlist = await ytpl(id);
    const songs: Song[] = [];
    playlist.items.forEach((item) => {
      songs.push({
        title: item.title,
        thumbnail: item.thumbnail ?? "",
        author: item.author?.name ?? "",
        url: item.url_simple,
        length: convertToSeconds(item.duration),
        platform: Platform.YOUTUBE,
      });
    });

    return {
      title: playlist.title,
      thumbnail: playlist.items[0]?.thumbnail ?? "",
      author: playlist.author?.name ?? "",
      songs,
    };
  }

  private static async searchVideo(keyword: string): Promise<string> {
    const result = await ytsr(keyword, { limit: 5 });
    const filteredRes = result.items.filter((item) => item.type === "video");
    if (filteredRes.length === 0) throw new Error();
    const item = filteredRes[0] as Video;
    return item.id;
  }

  public static isPlaylist(url: string): string | null {
    const paths = url.match(youtubePlaylistRegex);
    if (paths) return paths[0];
    return null;
  }

  private static generateVideoUrl(id: string) {
    return `https://www.youtube.com/watch?v=${id}`;
  }
}
