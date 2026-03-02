import mongoose from 'mongoose';

const ClockStateSchema = new mongoose.Schema({
    secondsToMidnight: {
        type: Number,
        required: true,
        default: 100, // Default start
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    reasonChange: {
        type: String, // Short summary of why it last moved
    },
    status: {
        type: String, // e.g., "Critical", "Stable"
        default: "Stable",
    },
    confidence: {
        type: String, // "High", "Medium", "Low"
    },
    // New mathematical modeling fields
    global_index: {
        type: Number,
        default: 0,
    },
    previous_global_index: {
        type: Number,
        default: 0,
    },
    daily_movement_total: {
        type: Number,
        default: 0,
    },
    domain_scores: {
        // Storing smoothed scores S_d(t) for tracking
        Nuclear: { type: Number, default: 0 },
        Climate: { type: Number, default: 0 },
        Biosecurity: { type: Number, default: 0 }, // Also called Pandemic
        AI: { type: Number, default: 0 },
        Geopolitical: { type: Number, default: 0 }
    },
    last_run_timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.ClockState || mongoose.model('ClockState', ClockStateSchema);
