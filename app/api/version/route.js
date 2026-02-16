import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        version: '1.0.4',
        timestamp: '2026-02-16T17:50:00Z',
        optimization: 'batch-1-forced-flash'
    });
}
