import { generateReactHelpers } from "@uploadthing/react";
import type { FileRouter } from "uploadthing/types";

type AnyUploadRoute = FileRouter[string];

/**
 * The route names must stay in sync with `api/src/uploadthing.ts`. Inputs are
 * intentionally loose here because the API router lives in a separate package.
 */
export type JeticFileRouter = Record<string, AnyUploadRoute> & {
  readonly workspaceIcon: AnyUploadRoute;
  readonly userAvatar: AnyUploadRoute;
};

export const UPLOADTHING_URL = `${(
  process.env.NEXT_PUBLIC_JETIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "")}/api/uploadthing`;

const API_ORIGIN = new URL(UPLOADTHING_URL).origin;

export const { useUploadThing } = generateReactHelpers<JeticFileRouter>({
  url: UPLOADTHING_URL,
  // The API session cookie lives on the API origin; file routes authenticate
  // with that cookie rather than the web-origin `jetic_session` cookie. Only
  // include credentials for our API, never for the UploadThing storage host.
  fetch: (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    return fetch(
      input,
      url.startsWith(API_ORIGIN)
        ? { ...init, credentials: "include" }
        : { ...init, credentials: "omit" },
    );
  },
});
