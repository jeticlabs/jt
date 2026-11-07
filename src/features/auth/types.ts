export interface AccountUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
  readonly githubId: string | null;
  readonly githubUsername: string | null;
  readonly usePassword: boolean;
  readonly hasPassword: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserEnvelope {
  readonly user: AccountUser;
}
