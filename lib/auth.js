import crypto from 'crypto';

export function validateAdminKey(request) {
    const apiKey = request.headers.get('x-admin-key');
    const configuredKey = process.env.ADMIN_API_KEY;

    if (!configuredKey) {
        console.error("ADMIN_API_KEY is not set in environment variables.");
        return false; // Fail safe
    }

    if (!apiKey) return false;

    // Constant-time comparison to prevent timing attacks
    const bufferApiKey = Buffer.from(apiKey);
    const bufferConfiguredKey = Buffer.from(configuredKey);

    if (bufferApiKey.length !== bufferConfiguredKey.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufferApiKey, bufferConfiguredKey);
}
