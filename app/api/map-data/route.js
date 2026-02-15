import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import RiskInput from '@/models/RiskInput';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch recent risks (last 24 hours) that have coordinates
        const recentRisks = await RiskInput.find({
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            'coordinates.lat': { $exists: true }
        }).limit(20);

        // Map to frontend format
        const regions = recentRisks.map(risk => ({
            id: risk._id.toString(),
            name: risk.region || "Unknown Region",
            riskLevel: risk.severity, // 0-100
            description: risk.description?.substring(0, 100) + "...",
            coordinates: { x: risk.coordinates.lng, y: risk.coordinates.lat } // MapView expects x/y (likely lat/lng mapped to projection)
            // Note: Components/MapView might expect specific x/y for a compiled SVG map. 
            // If using a real map library (Leaflet/Mapbox), lat/lng is fine. 
            // If using a static SVG, we might need to project lat/lng to x/y percentages.
            // For now, let's pass lat/lng and assume MapView can handle or we update MapView.
        }));

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
