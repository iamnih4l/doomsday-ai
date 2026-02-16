import { NextResponse } from 'next/server';
import { AIService } from '@/lib/services/aiService';
import { validateAdminKey } from '@/lib/auth';

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

export async function POST(request) {
    if (!validateAdminKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await AIService.evaluateRisks();
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json(
            { error: 'Evaluation failed', details: error.message },
            { status: 500 }
        );
    }
}
