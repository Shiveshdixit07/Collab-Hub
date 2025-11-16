const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const brandSchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true },
        contactPerson: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        industry: {
            type: String,
            required: true,
            enum: ['fashion', 'beauty', 'technology', 'food', 'health', 'travel', 'automotive', 'other']
        },
        companySize: {
            type: String,
            required: true,
            enum: ['startup', 'small', 'medium', 'large', 'enterprise']
        },
        budget: {
            type: String,
            required: true,
            enum: ['1k-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k+']
        },
        password: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

brandSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

brandSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;