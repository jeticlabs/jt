export interface GitHubConnection {
  readonly connected: boolean;
  readonly username: string | null;
  readonly avatarUrl: string | null;
  readonly credentialsStored: boolean;
}

export interface GitHubAccount {
  readonly id: string;
  readonly login: string;
  readonly avatarUrl: string | null;
  readonly type: "user" | "organization";
  readonly description: string | null;
}

export interface GitHubRepository {
  readonly id: string;
  readonly owner: string;
  readonly ownerAvatarUrl: string | null;
  readonly ownerType: "user" | "organization";
  readonly name: string;
  readonly fullName: string;
  readonly url: string;
  readonly htmlUrl: string;
  readonly description: string | null;
  readonly defaultBranch: string;
  readonly language: string | null;
  readonly isPrivate: boolean;
  readonly archived: boolean;
  readonly fork: boolean;
  readonly stars: number;
  readonly updatedAt: string;
  readonly pushedAt: string | null;
}

export interface GitHubBranch {
  readonly name: string;
  readonly commitSha: string;
  readonly protected: boolean;
}

export interface GitHubRepositoryPage {
  readonly data: GitHubRepository[];
  readonly page: {
    readonly page: number;
    readonly perPage: number;
    readonly hasMore: boolean;
  };
}

export interface GitHubAppInstallation {
  readonly id: string;
  readonly installationId: string;
  readonly accountLogin: string;
  readonly accountType: string;
  readonly repositorySelection: string | null;
  readonly suspended: boolean;
  readonly createdAt: string;
}

export interface GitHubAppConnection {
  readonly connected: boolean;
  readonly appConfigured: boolean;
  readonly installationId: string | null;
  readonly accountLogin: string | null;
  readonly accountType: string | null;
  readonly repositorySelection: string | null;
  readonly suspended: boolean;
  readonly installations: GitHubAppInstallation[];
}

export interface RepositoryAlert {
  readonly id: string;
  readonly discoveredAt: string;
  readonly repository: GitHubRepository;
}
