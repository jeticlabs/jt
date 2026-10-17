type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown) {
  const prefix = `[jetic:${level}]`;
  if (meta !== undefined) {
    console[level](prefix, message, meta);
  } else {
    console[level](prefix, message);
  }
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
