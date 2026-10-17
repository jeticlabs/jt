export interface EnvironmentConfig {
  id: string;
  name: string;
  /** Secret references only — never raw secret values. */
  secretRefs: string[];
}
