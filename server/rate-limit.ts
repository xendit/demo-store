import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// In-memory limiter, 20 requests per 60s per client.
const limiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

// Use the last X-Forwarded-For as the rate-limit key.
function getClientIp(req: Request): string {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor) {
    return xForwardedFor.split(",").pop()?.trim() ?? "unknown";
  }

  return req.ip ?? "unknown";
}

export async function checkoutRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    await limiter.consume(getClientIp(req));
  } catch (rejection) {
    const msBeforeNext = (rejection as { msBeforeNext?: number })?.msBeforeNext ?? 1000;
    res.setHeader("Retry-After", String(Math.ceil(msBeforeNext / 1000)));
    res.status(429).json({ error: "Too many requests, please try again later." });
    return;
  }
  next();
}
