import { describe, it, expect } from "vitest";
import { endpoints } from "@/lib/api/endpoints";

describe("simulation-workflow", () => {
  it("builds nested simulation paths", () => {
    expect(endpoints.simulation("ws_1", "sim_1")).toBe(
      "/workspaces/ws_1/simulations/sim_1"
    );
  });
});
