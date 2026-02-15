import mongoose from 'mongoose';

const AIDecisionSchema = new mongoose.Schema({
    decision: {
        type: String,
        required: true,
        enum: ['forward', 'backward', 'no_change'],
    },
    deltaSeconds: {
        type: Number,
        required: true,
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    primaryFactors: [{
        type: String,
    }],
    explanation: {
        type: String,
        required: true,
    },
    rawOutput: {
        type: mongoose.Schema.Types.Mixed, // Store full LLM response for debugging
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.AIDecision || mongoose.model('AIDecision', AIDecisionSchema);
