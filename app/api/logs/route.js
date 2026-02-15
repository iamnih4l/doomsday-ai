import { NextResponse } from 'next/server';
import AuditLog from '@/models/AuditLog';
import connectToDatabase from '@/lib/db';
import { validateAdminKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    if (!validateAdminKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch logs', details: error.message },
            { status: 500 }
        );
    }
}
