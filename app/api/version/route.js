import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        version: '1.0.6',
        timestamp: '2026-02-16T18:15:00Z',
        optimization: 'batch-1-forced-flash'
    });
}
