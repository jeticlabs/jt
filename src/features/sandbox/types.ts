import type { Plan } from "@/features/workspace/types";

export type SandboxStatus =
  | "provisioning"
  | "active"
  | "stopped"
  | "error"
  | "archived"
  | "suspended";

export type SandboxRuntimeProvider = "vercel" | "development";

export interface SandboxRepository {
  readonly id: string;
  readonly provider: "github";
  readonly externalId: string;
  readonly owner: string;
  readonly name: string;
  readonly fullName: string;
  readonly url: string;
  readonly htmlUrl: string | null;
  readonly description: string | null;
  readonly defaultBranch: string;
  readonly language: string | null;
  readonly isPrivate: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Sandbox {
  readonly id: string;
  readonly organizationId: string;
  readonly repositoryId: string | null;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly status: SandboxStatus;
  readonly source: "github" | "blank";
  readonly runtimeProvider: SandboxRuntimeProvider;
  readonly framework: string | null;
  readonly language: string | null;
  readonly repositoryUrl: string | null;
  readonly repositoryName: string | null;
  readonly repositoryOwner: string | null;
  readonly defaultBranch: string | null;
  readonly rootDirectory: string;
  readonly buildCommand: string | null;
  readonly outputDirectory: string | null;
  readonly runtimeName: string | null;
  readonly runtimeStatus: string | null;
  readonly previewUrl: string | null;
  readonly config: unknown;
  readonly lastError: string | null;
  readonly createdById: string;
  readonly lastStartedAt: string | null;
  readonly archivedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly repository: SandboxRepository | null;
}

export interface SandboxEnvelope {
  readonly sandbox: Sandbox;
}

export interface CreateSandboxPayload {
  readonly name: string;
  readonly slug?: string;
  readonly description?: string | null;
  readonly repository: {
    readonly owner: string;
    readonly name: string;
    readonly branch?: string;
  };
  readonly rootDirectory?: string;
  readonly language?: string | null;
  readonly framework?: string | null;
  readonly buildCommand?: string | null;
  readonly outputDirectory?: string | null;
  readonly environmentVariables?: readonly {
    readonly key: string;
    readonly value: string;
    readonly isSecret?: boolean;
  }[];
}

export interface SandboxPlanContext {
  readonly workspacePlan?: Plan;
}
