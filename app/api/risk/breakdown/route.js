import { NextResponse } from 'next/server';
import { RiskAggregationService } from '@/lib/services/riskAggregationService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await RiskAggregationService.getRiskBreakdown();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch risk breakdown', details: error.message },
            { status: 500 }
        );
    }
}
