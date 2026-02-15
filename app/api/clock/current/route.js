import { NextResponse } from 'next/server';
import { ClockService } from '@/lib/services/clockService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const state = await ClockService.getCurrentState();
        return NextResponse.json(state);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
