const express=require('express');
const router=express.Router();
const Influencer=require('../models/Influencer');

router.post('/signup/influencers',async(req,res)=>{
    const {firstName,lastName,email,instagram,followers,category,location,password}=req.body;
    try{
        const existingInfluencer=await Influencer.findOne({email});
        if(existingInfluencer){
            return res.status(400).json({message:'Influencer already exists'});
        }       
        const newInfluencer=new Influencer({firstName,lastName,email,instagram,followers,category,location,password});
        await newInfluencer.save();
        res.status(201).json({message:'Influencer created successfully'});
    }catch(error){
        res.status(500).json({message:'Error creating influencer'});
    }
});
router.post('/login/influencers',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const influencer=await Influencer.findOne({email});
        if(!influencer){
            return res.status(401).json({message:'influencer not found'});
        }
        const isPasswordCorrect=await influencer.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:'Invalid password'});
        }
        // Return influencer data excluding password
        const influencerData = {
            _id: influencer._id,
            firstName: influencer.firstName,
            lastName: influencer.lastName,
            email: influencer.email,
            instagram: influencer.instagram,
            followers: influencer.followers,
            category: influencer.category,
            location: influencer.location
        };
        res.status(200).json({message:'Login successful', influencer: influencerData});
    }catch(error){
        res.status(500).json({message:'Error logging in influencer',error:error.message});
    }
});

module.exports=router;