import { NextResponse } from 'next/server';
import { NewsService } from '@/lib/services/newsService';
import { validateAdminKey } from '@/lib/auth';

// This endpoint can be hit by a Cron Job
export async function POST(request) {
    // Authorization check (Cron or Admin)
    const authHeader = request.headers.get('authorization');
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isAdmin = validateAdminKey(request);

    // Vercel Cron protection check (optional, or use admin key)
    if (!isAdmin && !isCron && process.env.NODE_ENV === 'production') {
        // For simplicity in this demo, let's allow Admin Key usage primarily
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await NewsService.fetchAndIngestNews();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        return NextResponse.json(
            { error: 'News ingestion failed', details: error.message },
            { status: 500 }
        );
    }
}
