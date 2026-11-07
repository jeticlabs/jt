/** Shared lifecycle state for asynchronous client stores. */
export type AsyncStatus = "idle" | "loading" | "ready" | "error";

export interface AsyncState {
  readonly status: AsyncStatus;
  readonly error: string | null;
}

export const idleAsync: AsyncState = { status: "idle", error: null };
