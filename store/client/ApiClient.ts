import axios, { AxiosInstance, AxiosResponse } from "axios";
import https from "https";

export default class ApiClient {
  private httpClient: AxiosInstance;

  constructor(token?: string | null) {
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    this.httpClient = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}api`,
      timeout: 50000,
      httpsAgent: agent,
      headers,
    });
  }

  public async getUser(): Promise<AxiosResponse<any> | null> {
    try {
      return await this.httpClient.get("/me");
    } catch {
      return null;
    }
  }

  public async getMediaPods(): Promise<AxiosResponse<any> | null> {
    try {
      return await this.httpClient.get("/media_pods");
    } catch {
      return null;
    }
  }

  public async getRecentsMediaPods(): Promise<AxiosResponse<any> | null> {
    try {
      return await this.httpClient.get("/media_pods?pagination=false&itemsPerPage=10");
    } catch {
      return null;
    }
  }

  public async getConfiguration(): Promise<AxiosResponse<any> | null> {
    try {
      return await this.httpClient.get("/configuration");
    } catch {
      return null;
    }
  }

  public async postUploadVideo(payload: FormData): Promise<AxiosResponse<any> | null> {
    try {
      return await this.httpClient.post("/media-pods/video/upload", payload);
    } catch {
      return null;
    }
  }
}
