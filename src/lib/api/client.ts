import { ApiError } from "./errors";
import { env } from "../env";

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => Promise<string | null> | string | null;
}

export class ApiClient {
  private baseUrl: string;
  private getToken?: ApiClientOptions["getToken"];

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? env.jeticApiUrl;
    this.getToken = options.getToken;
  }

  private async headers(init?: HeadersInit): Promise<Headers> {
    const headers = new Headers(init);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const token = await this.getToken?.();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: await this.headers(init.headers),
    });

    if (!res.ok) {
      throw new ApiError(res.status, res.statusText, path);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();
