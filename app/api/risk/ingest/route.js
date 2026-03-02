import { NextResponse } from 'next/server';
import { RiskIngestionService } from '@/lib/services/riskIngestionService';
import { validateAdminKey } from '@/lib/auth';
import { RiskInputSchema } from '@/validations/risk';

export async function POST(request) {
    if (!validateAdminKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Strict Validation
        const validation = RiskInputSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid Input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const risk = await RiskIngestionService.ingestRisk(validation.data);
        return NextResponse.json({ success: true, risk });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to ingest risk', details: error.message },
            { status: 400 }
        );
    }
}
