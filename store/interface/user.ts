import { MediaPod } from "./media-pod";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatarUrl: string;
  mediaPods: MediaPod[];
  createdAt: string;
  updatedAt: string;
  uuid: string;
}
