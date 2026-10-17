export class ApiError extends Error {
  status: number;
  path: string;

  constructor(status: number, message: string, path: string) {
    super(`API ${status} ${path}: ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}
