import { Configuration } from "./configuration";
import { Video } from "./video";

export interface MediaPod {
  videoName: string | null;
  originalVideo: Video;
  processedVideo: Video | null;
  finalVideo: Video[];
  configuration: Configuration;
  status: string;
  statuses: string[];
  createdAt: string;
  updatedAt: string;
  uuid: string;
}
