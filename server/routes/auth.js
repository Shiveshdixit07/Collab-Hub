const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const Brand = require('../models/Brand');
const mongoose = require('mongoose');
const { analyzeInstagram } = require('../utils/instagram');

router.post('/signup/influencers', async (req, res) => {
    const { firstName, lastName, email, instagram, followers, category, location, password, campaigns } = req.body;
    try {
        const existingInfluencer = await Influencer.findOne({ email });
        if (existingInfluencer) {
            return res.status(400).json({ message: 'Influencer already exists' });
        }

        // Sanitize instagram handle (allow with or without leading @)
        const igHandle = (instagram || '').toString().trim().replace(/^@+/, '');
        // Verify instagram username and compute average likes / engagement
        const igResult = await analyzeInstagram(igHandle);
        if (!igResult || !igResult.exists) {
            return res.status(400).json({ message: 'Instagram user not found or not publicly accessible', details: igResult?.error || null });
        }

        const payload = {
            firstName,
            lastName,
            email,
            instagram,
            followers,
            category,
            location,
            password,
            campaigns: campaigns || []
        };

        if (typeof igResult.followers === 'number') payload.followersCount = igResult.followers;
        if (typeof igResult.avgLikes === 'number') payload.avgLikes = igResult.avgLikes;
        if (typeof igResult.engagement === 'number') payload.engagement = igResult.engagement;

        const newInfluencer = new Influencer(payload);
        await newInfluencer.save();
        res.status(201).json({ message: 'Influencer created successfully', influencer: { _id: newInfluencer._id, firstName, lastName, email, instagram, followers, category, location, campaigns: newInfluencer.campaigns || [], avgLikes: newInfluencer.avgLikes, engagement: newInfluencer.engagement } });
    } catch (error) {
        console.error('Influencer signup error:', error);
        res.status(500).json({ message: 'Error creating influencer', error: error.message });
    }
});
router.post('/login/influencers', async (req, res) => {
    const { email, password } = req.body;
    try {
        const influencer = await Influencer.findOne({ email });
        if (!influencer) {
            return res.status(401).json({ message: 'influencer not found' });
        }
        const isPasswordCorrect = await influencer.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
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
            location: influencer.location,
            campaigns: influencer.campaigns || [],
            avgLikes: influencer.avgLikes || null,
            engagement: influencer.engagement || null,
            followersCount: influencer.followersCount || null
        };
        res.status(200).json({ message: 'Login successful', influencer: influencerData });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in influencer', error: error.message });
    }
});

// Respond to an influencer campaign invite: accept or reject
router.patch('/influencers/:influencerId/campaigns/:campaignId/respond', async (req, res) => {
    const { influencerId, campaignId } = req.params;
    const { action } = req.body; // expected 'accept' or 'reject'
    try {
        const influencer = await Influencer.findById(influencerId);
        if (!influencer) return res.status(404).json({ message: 'Influencer not found' });

        const campaign = influencer.campaigns.id(campaignId);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        if (action === 'accept') {
            campaign.status = 'Active';
        } else if (action === 'reject') {
            campaign.status = 'Cancelled';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await influencer.save();

        // return updated campaign and influencer campaigns
        return res.status(200).json({ message: 'Campaign updated', campaign, campaigns: influencer.campaigns });
    } catch (error) {
        console.error('Campaign respond error:', error);
        return res.status(500).json({ message: 'Error updating campaign', error: error.message });
    }
});

// Brand Routes
router.post('/signup/brands', async (req, res) => {
    const { companyName, contactPerson, phone, email, industry, companySize, budget, password } = req.body;
    try {
        const existingBrand = await Brand.findOne({ email });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }
        const newBrand = new Brand({
            companyName,
            contactPerson,
            phone,
            email,
            industry,
            companySize,
            budget,
            password
        });
        await newBrand.save();
        res.status(201).json({ message: 'Brand created successfully' });
    } catch (error) {
        console.error('Brand signup error:', error);
        res.status(500).json({ message: 'Error creating brand', error: error.message });
    }
});

router.post('/login/brands', async (req, res) => {
    const { email, password } = req.body;
    try {
        const brand = await Brand.findOne({ email });
        if (!brand) {
            return res.status(401).json({ message: 'Brand not found' });
        }
        const isPasswordCorrect = await brand.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Return brand data excluding password
        const brandData = {
            _id: brand._id,
            companyName: brand.companyName,
            contactPerson: brand.contactPerson,
            phone: brand.phone,
            email: brand.email,
            industry: brand.industry,
            companySize: brand.companySize,
            budget: brand.budget,
            createdAt: brand.createdAt
        };
        res.status(200).json({ message: 'Login successful', brand: brandData });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in brand', error: error.message });
    }
});

module.exports = router;
