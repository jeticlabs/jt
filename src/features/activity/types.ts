export interface ActivityEvent {
  readonly id: string;
  readonly organizationId: string;
  readonly sandboxId: string | null;
  readonly type: string;
  readonly source: string;
  readonly actorType: string | null;
  readonly actorId: string | null;
  readonly actorName: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly metadata: unknown;
  readonly createdAt: string;
}

export interface ActivityPage {
  readonly data: ActivityEvent[];
  readonly page: {
    readonly nextCursor: string | null;
    readonly hasMore: boolean;
  };
}
