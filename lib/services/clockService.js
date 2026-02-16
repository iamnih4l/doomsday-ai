import ClockState from '@/models/ClockState';
import AuditLog from '@/models/AuditLog';
import AIDecision from '@/models/AIDecision'; // Import AIDecision to check for latest activity
import connectToDatabase from '@/lib/db';

export class ClockService {
    static async getCurrentState() {
        await connectToDatabase();

        // Get the most recent clock state
        // Fix: Sort by 'lastUpdated' (schema field) instead of 'timestamp'
        const state = await ClockState.findOne().sort({ lastUpdated: -1 });

        // Also get the latest AI decision to see if we have a more recent "verification"
        const latestDecision = await AIDecision.findOne().sort({ timestamp: -1 });

        if (!state) {
            return this.initializeClock();
        }

        // Convert mongoose document to object to allow modification
        const stateObj = state.toObject();

        // If we have a decision that is newer than the clock state, use that as the "Last Updated"
        // This tells the user the system is alive and verifying, even if the clock hasn't moved.
        if (latestDecision && new Date(latestDecision.timestamp) > new Date(state.lastUpdated)) {
            stateObj.lastUpdated = latestDecision.timestamp;
            // Optionally add a flag to indicate this was a verification, not a move
            stateObj.isVerification = true;
        }

        return stateObj;
    }

    static async initializeClock() {
        await connectToDatabase();
        const initialState = await ClockState.create({
            secondsToMidnight: 90,
            reasonChange: "Initial System Setup",
            status: "Stable",
            confidence: "High",
            lastUpdated: new Date() // Fix: Use 'lastUpdated' to match schema
        });
        return initialState;
    }

    static async updateClock(decision, deltaSeconds, reason, confidence) {
        await connectToDatabase();

        // 1. Get current state (raw) to calculate from
        const currentStateDoc = await ClockState.findOne().sort({ lastUpdated: -1 });
        const currentSeconds = currentStateDoc ? currentStateDoc.secondsToMidnight : 90;

        // 2. Validate move bounds
        let newSeconds = currentSeconds;

        if (decision === 'forward') {
            newSeconds -= deltaSeconds;
        } else if (decision === 'backward') {
            newSeconds += deltaSeconds;
        }

        // Hard clamp between 0 and 1200 (20 mins)
        newSeconds = Math.max(0, Math.min(newSeconds, 1200));

        // 3. Create new state entry
        const newState = await ClockState.create({
            secondsToMidnight: newSeconds,
            reasonChange: reason,
            status: newSeconds < 60 ? "Critical" : (newSeconds < 180 ? "Elevated" : "Stable"),
            confidence: confidence,
            lastUpdated: new Date() // Fix: Use 'lastUpdated'
        });

        // 4. Log audit
        await AuditLog.create({
            action: 'CLOCK_UPDATE',
            actor: 'System',
            details: {
                oldSeconds: currentSeconds,
                newSeconds: newSeconds,
                decision,
                reason
            }
        });

        return newState;
    }

    static async getHistory(limit = 10) {
        await connectToDatabase();
        return ClockState.find().sort({ lastUpdated: -1 }).limit(limit);
    }
}
