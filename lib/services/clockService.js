import ClockState from '@/models/ClockState';
import AuditLog from '@/models/AuditLog';
import connectToDatabase from '@/lib/db';

export class ClockService {
    static async getCurrentState() {
        await connectToDatabase();
        // Get the most recent clock state
        const state = await ClockState.findOne().sort({ timestamp: -1 });
        if (!state) {
            // If no state exists, initialize one (90 seconds to midnight)
            return this.initializeClock();
        }
        return state;
    }

    static async initializeClock() {
        await connectToDatabase();
        const initialState = await ClockState.create({
            secondsToMidnight: 90,
            reasonChange: "Initial System Setup",
            status: "Stable",
            confidence: "High",
            timestamp: new Date()
        });
        return initialState;
    }

    static async updateClock(decision, deltaSeconds, reason, confidence) {
        await connectToDatabase();

        // 1. Get current state
        const currentState = await this.getCurrentState();

        // 2. Validate move bounds
        // Clock cannot go below 0 (midnight) or above arbitrary safe limit (e.g. 15 mins)
        let newSeconds = currentState.secondsToMidnight;

        if (decision === 'forward') {
            newSeconds -= deltaSeconds;
        } else if (decision === 'backward') {
            newSeconds += deltaSeconds;
        }

        // Hard clamp between 0 and 1200 (20 mins)
        newSeconds = Math.max(0, Math.min(newSeconds, 1200));

        // 3. Rate limiting / Cooldown check (Optional, can be added here)
        // For now, we trust the AI/Admin layer to respect cooldowns, but we could enforce it here.

        // 4. Create new state entry
        const newState = await ClockState.create({
            secondsToMidnight: newSeconds,
            reasonChange: reason,
            status: newSeconds < 60 ? "Critical" : (newSeconds < 180 ? "Elevated" : "Stable"),
            confidence: confidence,
            timestamp: new Date()
        });

        // 5. Log audit
        await AuditLog.create({
            action: 'CLOCK_UPDATE',
            actor: 'System',
            details: {
                oldSeconds: currentState.secondsToMidnight,
                newSeconds: newSeconds,
                decision,
                reason
            }
        });

        return newState;
    }

    static async getHistory(limit = 10) {
        await connectToDatabase();
        return ClockState.find().sort({ timestamp: -1 }).limit(limit);
    }
}
