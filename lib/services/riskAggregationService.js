import RiskInput from '@/models/RiskInput';
import connectToDatabase from '@/lib/db';

export class RiskAggregationService {
    static async getRiskBreakdown() {
        await connectToDatabase();

        // Aggregate risks by category
        const aggregation = await RiskInput.aggregate([
            { $match: { processed: true } }, // Only count processed risks? or all? Let's say all recent valid ones.
            // Actually, for "current status", we might want the latest risks.
            // Let's group by category and get the average severity.
            {
                $group: {
                    _id: "$category",
                    avgSeverity: { $avg: "$severity" },
                    count: { $sum: 1 },
                    lastUpdated: { $max: "$timestamp" }
                }
            }
        ]);

        // Map to frontend domain format
        const domains = aggregation.map(item => ({
            id: item._id.toLowerCase(),
            name: `${item._id} Risk`,
            score: Math.round(item.avgSeverity),
            change: 0, // We'd need historical data for change, defaulting to 0 for now
            description: `Based on ${item.count} recent reports.`,
            icon: this.getIconForCategory(item._id)
        }));

        // Fill in missing domains with default low risk if needed (optional)
        // ensure we have the 5 core ones if they are missing? 
        // For now returning what we have is honest.

        return {
            domains,
            lastUpdated: new Date()
        };
    }

    static getIconForCategory(category) {
        const map = {
            'Nuclear': 'Radiation',
            'Climate': 'CloudRain',
            'AI': 'Cpu',
            'Biosecurity': 'Activity',
            'Geopolitical': 'Globe'
        };
        return map[category] || 'Globe';
    }
}
