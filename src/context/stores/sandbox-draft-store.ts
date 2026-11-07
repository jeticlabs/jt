"use client";

import { create } from "zustand";

import type { GitHubRepository } from "@/features/github/types";
import type { Sandbox } from "@/features/sandbox/types";

export type CreateSandboxStep = "source" | "repositories" | "configure" | "create";

export interface EnvVarDraft {
  readonly key: string;
  readonly value: string;
}

function languageFor(repository: GitHubRepository): string {
  const language = repository.language?.toLowerCase() ?? "";
  if (language.includes("typescript") || language.includes("javascript")) return "node";
  if (language.includes("python")) return "python";
  if (language.includes("go")) return "go";
  if (language.includes("rust")) return "rust";
  return "other";
}

interface SandboxDraftState {
  readonly step: CreateSandboxStep;
  readonly selectedRepository: GitHubRepository | null;
  readonly branch: string;
  readonly name: string;
  readonly rootDirectory: string;
  readonly language: string;
  readonly buildCommand: string;
  readonly outputDirectory: string;
  readonly envVars: readonly EnvVarDraft[];
  readonly creating: boolean;
  readonly sandboxId: string | null;
  readonly sandbox: Sandbox | null;
  readonly error: string | null;

  setStep: (step: CreateSandboxStep) => void;
  selectRepository: (repository: GitHubRepository, branch?: string) => void;
  setBranch: (branch: string) => void;
  setName: (name: string) => void;
  setRootDirectory: (value: string) => void;
  setLanguage: (value: string) => void;
  setBuildCommand: (value: string) => void;
  setOutputDirectory: (value: string) => void;
  setEnvVar: (index: number, field: keyof EnvVarDraft, value: string) => void;
  addEnvVar: () => void;
  removeEnvVar: (index: number) => void;
  beginCreate: () => void;
  created: (sandbox: Sandbox) => void;
  failed: (message: string) => void;
  reset: () => void;
}

const initialState = {
  step: "source" as CreateSandboxStep,
  selectedRepository: null as GitHubRepository | null,
  branch: "main",
  name: "untitled-sandbox",
  rootDirectory: ".",
  language: "node",
  buildCommand: "",
  outputDirectory: "",
  envVars: [{ key: "", value: "" }] as EnvVarDraft[],
  creating: false,
  sandboxId: null as string | null,
  sandbox: null as Sandbox | null,
  error: null as string | null,
};

export const useSandboxDraftStore = create<SandboxDraftState>((set) => ({
  ...initialState,

  setStep(step) {
    set({ step });
  },

  selectRepository(repository, branch) {
    set({
      selectedRepository: repository,
      branch: branch ?? repository.defaultBranch,
      name: repository.name,
      language: languageFor(repository),
      step: "configure",
    });
  },

  setBranch(branch) {
    set({ branch });
  },

  setName(name) {
    set({ name });
  },

  setRootDirectory(rootDirectory) {
    set({ rootDirectory });
  },

  setLanguage(language) {
    set({ language });
  },

  setBuildCommand(buildCommand) {
    set({ buildCommand });
  },

  setOutputDirectory(outputDirectory) {
    set({ outputDirectory });
  },

  setEnvVar(index, field, value) {
    set((state) => ({
      envVars: state.envVars.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  },

  addEnvVar() {
    set((state) => ({ envVars: [...state.envVars, { key: "", value: "" }] }));
  },

  removeEnvVar(index) {
    set((state) => {
      const next = state.envVars.filter((_, rowIndex) => rowIndex !== index);
      return { envVars: next.length > 0 ? next : [{ key: "", value: "" }] };
    });
  },

  beginCreate() {
    set({ step: "create", creating: true, error: null, sandboxId: null, sandbox: null });
  },

  created(sandbox) {
    set({
      sandbox,
      sandboxId: sandbox.id,
      creating: sandbox.status === "provisioning",
      error: null,
    });
  },

  failed(message) {
    set({ creating: false, error: message });
  },

  reset() {
    set({ ...initialState });
  },
}));
