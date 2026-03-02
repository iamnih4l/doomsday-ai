import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import RiskInput from '@/models/RiskInput';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        // Helper to generate deterministic stable coordinates
        const getStableCoords = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
            return {
                lat: (hash % 120) - 45,       // -45 to +75 latitude bias
                lng: ((hash >> 8) % 360) - 180 // full 360 longitude
            };
        };

        // Fetch recent risks (last 24 hours)
        const recentRisks = await RiskInput.find({
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ timestamp: -1 }).limit(20);

        // Map to frontend format
        const regions = recentRisks.map(risk => {
            const coords = risk.coordinates?.lat ? risk.coordinates : getStableCoords(risk.source);
            return {
                id: risk._id.toString(),
                name: (risk.source || "Global Alert").split(':')[0],
                riskLevel: risk.severity || 50, // UI minimum visibility
                description: risk.description?.substring(0, 100) + "...",
                coordinates: { x: coords.lng, y: coords.lat }
            };
        });

        // Fallback if empty (so map isn't blank during demo)
        if (regions.length === 0) {
            return NextResponse.json({
                regions: [
                    { id: "demo-1", name: "No Active Risks", riskLevel: 0, description: "Global situation stable.", coordinates: { x: 0, y: 0 } }
                ]
            });
        }

        return NextResponse.json({ regions });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch map data', details: error.message },
            { status: 500 }
        );
    }
}
