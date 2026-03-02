import mongoose from 'mongoose';

const HeadlineHashSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '48h' } // Automatically delete documents after 48 hours to save space
    }
});

export default mongoose.models.HeadlineHash || mongoose.model('HeadlineHash', HeadlineHashSchema);
