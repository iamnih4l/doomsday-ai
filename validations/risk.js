import { z } from 'zod';

export const RiskInputSchema = z.object({
    category: z.enum(['Nuclear', 'Climate', 'AI', 'Biosecurity', 'Geopolitical', 'Other']),
    severity: z.number().min(0).max(100),
    confidence: z.number().min(0).max(1),
    source: z.string().min(3).max(500), // Prevent huge payloads
    description: z.string().optional().refine(val => !val || val.length < 2000, "Description too long"),
    timestamp: z.string().datetime().optional()
});
