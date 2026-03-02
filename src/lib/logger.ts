/**
 * Centralized logger – replaces raw console.* calls in production.
 * 
 * In development: all levels output to console.
 * In production: only `warn` and `error` output. `log` and `debug` are no-ops.
 */

const isDev = process.env.NODE_ENV === "development";

function noop() {}

export const logger = {
  /** Debug-level – only in dev */
  debug: isDev ? console.debug.bind(console) : noop,

  /** Info-level – only in dev */
  log: isDev ? console.log.bind(console) : noop,

  /** Warnings – always active */
  warn: console.warn.bind(console),

  /** Errors – always active */
  error: console.error.bind(console),
};
