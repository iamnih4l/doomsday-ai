import RiskInput from '@/models/RiskInput';
import AuditLog from '@/models/AuditLog';
import connectToDatabase from '@/lib/db';

export class RiskIngestionService {
    static async ingestRisk(data) {
        await connectToDatabase();

        // Validate basics (Schema handles most validation)
        if (!data.category || !data.severity || !data.source) {
            throw new Error("Missing required risk fields");
        }

        const risk = await RiskInput.create({
            ...data,
            timestamp: new Date(),
            processed: false
        });

        await AuditLog.create({
            action: 'RISK_INGEST',
            actor: 'Admin', // Ingest is an admin/system action
            details: {
                riskId: risk._id,
                category: risk.category,
                severity: risk.severity
            }
        });

        return risk;
    }

    static async getUnprocessedRisks() {
        await connectToDatabase();
        return RiskInput.find({ processed: false }).sort({ timestamp: 1 });
    }

    static async markRisksAsProcessed(riskIds) {
        await connectToDatabase();
        return RiskInput.updateMany(
            { _id: { $in: riskIds } },
            { $set: { processed: true } }
        );
    }
}
