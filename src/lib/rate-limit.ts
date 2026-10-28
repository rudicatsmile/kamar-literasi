/**
 * In-memory sliding window rate limiter for Server Actions and API endpoints.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    const fresh = record.timestamps.filter((ts) => now - ts < 3600000); // 1 hour
    if (fresh.length === 0) {
      store.delete(key);
    } else {
      store.set(key, { timestamps: fresh });
    }
  }
}, 300000);

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60000 }
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = store.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  const windowStart = now - options.windowMs;
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= options.limit) {
    const oldest = recentTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + options.windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  recentTimestamps.push(now);
  store.set(identifier, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: options.limit - recentTimestamps.length,
    retryAfterSeconds: 0,
  };
}
