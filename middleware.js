import { NextResponse } from 'next/server';

// Simple in-memory rate limit map (Note: checking IP in serverless is tricky, this is best-effort)
// For production, use Vercel KV or Upstash
const rateLimitMap = new Map();

export function middleware(request) {
    const response = NextResponse.next();

    // 1. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // 2. Rate Limiting (Simple Token Bucket per IP)
    const ip = request.ip || '127.0.0.1';
    const limit = 100; // Requests per window
    const windowMs = 60 * 1000; // 1 minute

    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const requestTimestamps = rateLimitMap.get(ip).filter(timestamp => timestamp > windowStart);
    requestTimestamps.push(now);
    rateLimitMap.set(ip, requestTimestamps);

    if (requestTimestamps.length > limit) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
