import { NextResponse } from 'next/server';
import AIDecision from '@/models/AIDecision';
import connectToDatabase from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const latestDecision = await AIDecision.findOne().sort({ timestamp: -1 });

        if (!latestDecision) {
            return NextResponse.json({
                explanation: "No AI decisions have been made yet.",
                timestamp: new Date()
            });
        }

        return NextResponse.json({
            explanation: latestDecision.explanation,
            confidence: latestDecision.confidence,
            factors: latestDecision.primaryFactors,
            decision: latestDecision.decision,
            timestamp: latestDecision.timestamp
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
