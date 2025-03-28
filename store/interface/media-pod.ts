import { Configuration } from "./configuration";
import { Video } from "./video";

export interface MediaPod {
  videoName: string | null;
  originalVideo: Video;
  processedVideo: Video | null;
  finalVideo: Video[];
  configuration: Configuration;
  status: string;
  frame: string | null;
  statuses: string[];
  createdAt: string;
  updatedAt: string;
  percent: number;
  uuid: string;
}
