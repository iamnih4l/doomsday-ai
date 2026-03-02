import ClockState from '@/models/ClockState';
import connectToDatabase from '@/lib/db';

export class RiskAggregationService {
    static async getRiskBreakdown() {
        await connectToDatabase();

        const stateDoc = await ClockState.findOne().sort({ lastUpdated: -1 });
        const domainScores = stateDoc ? stateDoc.domain_scores || {} : {};

        // Define domains manually if empty
        const defaultScores = { Nuclear: 50, Climate: 50, Biosecurity: 50, AI: 50, Geopolitical: 50 };
        const activeScores = Object.keys(domainScores).length > 0 ? domainScores : defaultScores;

        const domains = [];
        for (const [category, score] of Object.entries(activeScores)) {
            // Convert to frontend format
            // Keep MongoDB doc _id/internal naming consistent
            // Note: The original returned "id: item._id.toLowerCase()". 
            // We use the keys: ['Nuclear', 'Climate', 'Biosecurity', 'AI', 'Geopolitical']
            if (typeof score !== 'number') continue;

            domains.push({
                id: category.toLowerCase(),
                name: `${category} Risk`,
                score: Math.round(score),
                change: 0, // In future, subtract from previous_domain_scores if implemented
                description: `Deterministic smoothed model score.`,
                icon: this.getIconForCategory(category)
            });
        }

        return {
            domains,
            lastUpdated: stateDoc ? stateDoc.lastUpdated : new Date()
        };
    }

    static getIconForCategory(category) {
        const map = {
            'Nuclear': 'Radiation',
            'Climate': 'CloudRain',
            'AI': 'Cpu',
            'Biosecurity': 'Activity',
            'Geopolitical': 'Globe',
            // Allow matching lowercase
            'nuclear': 'Radiation',
            'climate': 'CloudRain',
            'ai': 'Cpu',
            'biosecurity': 'Activity',
            'geopolitical': 'Globe'
        };
        return map[category] || 'Globe';
    }
}
