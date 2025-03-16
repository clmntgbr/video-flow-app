import { Configuration } from "./configuration";

export type PostUploadVideo = {
  video: File | null;
} & Configuration;
