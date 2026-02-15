import { NextResponse } from 'next/server';
import { ClockService } from '@/lib/services/clockService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const history = await ClockService.getHistory(20);
        return NextResponse.json({ history });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
