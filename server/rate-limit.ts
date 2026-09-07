import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// In-memory limiter, 20 requests per 60s per client.
const limiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

// This IP is used as the rate-limit key, CF-Connecting-IP (always overwritten by Cloudflare) is preferred over X-Forwarded-For first entry.
function getClientIp(req: Request): string {
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp) {
    return cfIp;
  }

  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  return req.ip ?? "unknown";
}

export async function checkoutRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    await limiter.consume(getClientIp(req));
    next();
  } catch (rejection) {
    const msBeforeNext = (rejection as { msBeforeNext?: number })?.msBeforeNext ?? 1000;
    res.setHeader("Retry-After", String(Math.ceil(msBeforeNext / 1000)));
    res.status(429).json({ error: "Too many requests, please try again later." });
  }
}
