import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    actor: {
        type: String, // "System" or "Admin"
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    ip: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
