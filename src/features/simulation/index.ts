export interface Simulation {
  id: string;
  workspaceId: string;
  name: string;
  status: "draft" | "running" | "passed" | "failed";
}
