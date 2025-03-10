export interface Video {
  originalName: string;
  name: string;
  mimeType: string;
  size: number;
  length: number | null;
  subtitle: string | null;
  ass: string | null;
  subtitles: any[];
  audios: any[];
  createdAt: string;
  updatedAt: string;
  uuid: string;
}
