/**
 * Application-wide types only.
 * Agent / simulation / repository types live next to their feature.
 */
export interface Workspace {
  id: string;
  name: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}
