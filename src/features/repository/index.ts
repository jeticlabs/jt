export interface RepositoryInfo {
  id: string;
  fullName: string;
  branch?: string;
  indexingStatus?: "pending" | "indexing" | "ready" | "error";
}
