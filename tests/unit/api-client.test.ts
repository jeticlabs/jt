import { describe, it, expect } from "vitest";
import { ApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("exposes status helpers", () => {
    expect(new ApiError(401, "x", "/y").isUnauthorized).toBe(true);
    expect(new ApiError(404, "x", "/y").isNotFound).toBe(true);
    expect(new ApiError(500, "x", "/y").isNotFound).toBe(false);
  });
});
