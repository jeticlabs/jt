import { readFile } from "node:fs/promises";
import { generateReactHelpers } from "@uploadthing/react";

const token = (
  await readFile(`${process.env.TEMP}\\jetic-smoke-token.txt`, "utf8")
).trim();
const url = "http://localhost:4000/api/uploadthing";
const { uploadFiles } = generateReactHelpers({
  url,
  fetch: (input, init) => {
    const href =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const headers = new Headers(init?.headers);
    if (href.startsWith("http://localhost:4000")) {
      headers.set("Cookie", `flowscan.session_token=${token}`);
    }
    return fetch(input, { ...init, headers });
  },
});

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=",
  "base64",
);
const file = new File([png], "test-avatar.png", { type: "image/png" });
const result = await uploadFiles("userAvatar", { files: [file] });
console.log(JSON.stringify(result, null, 2));
