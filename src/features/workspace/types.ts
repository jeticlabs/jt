export type Plan = "hobby" | "pro";

export type OrganizationRole = "member" | "admin" | "owner";

export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly plan: Plan;
  readonly logo: string | null;
  readonly metadata: unknown;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrganizationMembership {
  readonly memberId: string;
  readonly role: OrganizationRole;
  readonly joinedAt: string;
  readonly organization: Organization;
}

/** The subset of an organization the toolbar and navigation need. */
export interface WorkspaceSummary {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly plan: Plan;
  readonly role: OrganizationRole;
  readonly memberId: string;
}

export interface MemberUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly image: string | null;
}

export interface Member {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly role: OrganizationRole;
  readonly user: MemberUser;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";

export interface Invitation {
  readonly id: string;
  readonly organizationId: string;
  readonly email: string;
  readonly role: OrganizationRole;
  readonly status: InvitationStatus;
  readonly inviterId: string;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** Development-only copyable link returned by the API. */
  readonly inviteUrl?: string | null;
}

export interface InvitationLookup {
  readonly organizationId: string;
  readonly organizationName: string;
  readonly email: string;
  readonly role: OrganizationRole;
  readonly status: InvitationStatus;
  readonly expiresAt: string;
  readonly expired: boolean;
}

export interface PageMeta {
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
}

export interface PageResponse<T> {
  readonly data: T[];
  readonly page: PageMeta;
}

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AuthSession {
  readonly id: string;
  readonly expiresAt: string;
  readonly activeOrganizationId: string | null;
  readonly createdAt: string;
}

export interface SessionEnvelope {
  readonly user: AuthUser;
  readonly session: AuthSession;
}

export interface SlugAvailability {
  readonly slug: string;
  readonly available: boolean;
}

export interface OnboardingResponse {
  readonly organization: Organization;
}
