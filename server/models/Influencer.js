const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const influencerSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        instagram: { type: String, required: true, unique: true },
        followers: {
            type: String,
            required: true,
            enum: ['1k-10k', '10k-50k', '50k-100k', '100k-500k', '500k-1m', '1m+']
        },
        category: { type: String, required: true },
        location: { type: String, required: true },
        password: { type: String, required: true },
        // campaigns the influencer is part of
        campaigns: {
            type: [
                {
                    brand: { type: String },
                    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
                    campaignName: { type: String },
                    status: { type: String, enum: ['Active', 'Review', 'Invited', 'Completed', 'Cancelled'], default: 'Invited' },
                    payout: { type: String },
                    due: { type: String },
                    startDate: { type: Date },
                    endDate: { type: Date },
                    role: { type: String },
                    deliverables: { type: String },
                    message: { type: String }
                }
            ],
            default: []
        },
        // computed metrics from Instagram analysis
        followersCount: { type: Number },
        avgLikes: { type: Number },
        engagement: { type: Number },
    }
)

influencerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

influencerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;