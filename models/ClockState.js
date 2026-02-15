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
    }
});

export default mongoose.models.ClockState || mongoose.model('ClockState', ClockStateSchema);
