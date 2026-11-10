import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// In-memory limiter, 20 requests per 60s per client.
const limiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

// Extract client IP: check CF-Connecting-IP first (Cloudflare), then first X-Forwarded-For IP, falling back to req.ip.
function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  if (typeof cfConnectingIp === "string" && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor) {
    const clientIp = xForwardedFor.split(",")[0]?.trim();
    if (clientIp) {
      return clientIp;
    }
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
