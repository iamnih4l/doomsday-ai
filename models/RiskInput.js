import mongoose from 'mongoose';

const RiskInputSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Nuclear', 'Climate', 'AI', 'Biosecurity', 'Geopolitical', 'Other'],
    },
    severity: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    source: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    processed: {
        type: Boolean,
        default: false, // Tracks if this input has been used in an AI decision
    },
    // Geo-location for Map
    region: { type: String, required: false }, // e.g. "Eastern Europe"
    coordinates: {
        lat: Number,
        lng: Number
    }
});

export default mongoose.models.RiskInput || mongoose.model('RiskInput', RiskInputSchema);
