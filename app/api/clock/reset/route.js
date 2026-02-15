import { NextResponse } from 'next/server';
import { ClockService } from '@/lib/services/clockService';
import { validateAdminKey } from '@/lib/auth';

export async function POST(request) {
    if (!validateAdminKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newState = await ClockService.initializeClock();
        return NextResponse.json({ success: true, state: newState, message: "Clock has been reset" });
    } catch (error) {
        return NextResponse.json(
            { error: 'Reset failed', details: error.message },
            { status: 500 }
        );
    }
}
