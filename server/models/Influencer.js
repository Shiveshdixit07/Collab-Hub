const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

const influencerSchema=new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        instagram: {type: String, required: true, unique: true},
        followers: {
            type: String,
            required: true,
            enum: ['1k-10k','10k-50k','50k-100k','100k-500k','500k-1m','1m+']
        },
        category: {type: String, required: true},
        location: {type: String, required: true},
        password: {type: String, required: true},
      }
)

influencerSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

influencerSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

const Influencer=mongoose.model('Influencer',influencerSchema);

module.exports=Influencer;