import mongoose from "mongoose";

const scanSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    target: { type: String, required: true },
    ip: { type: String },
    location: { type: String },
    riskScore: { type: Number },
    ports: [{ type: Number }],
    tech_stack: [{ type: String }],
    security_issues: [{ type: String }],

    // NEW FIELDS
    ssl_info: {
        valid: Boolean,
        issuer: String,
        expires: String,
        days_left: Number
    },
    dns_records: {
        mx: [{ type: String }],
        ns: [{ type: String }],
        txt: [{ type: String }]
    },

    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;