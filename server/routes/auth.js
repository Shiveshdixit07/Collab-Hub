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

// Recommend influencers for a brand based on industry, budget and influencer metrics
router.get('/brands/:brandId/recommendations', async (req, res) => {
    const { brandId } = req.params;
    try {
        const brand = await Brand.findById(brandId);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        // Budget to follower median mapping
        const budgetTargets = {
            '1k-5k': [1000, 10000],
            '5k-10k': [10000, 50000],
            '10k-25k': [50000, 100000],
            '25k-50k': [100000, 500000],
            '50k-100k': [500000, 1000000],
            '100k+': [1000000, 10000000]
        };

        const target = budgetTargets[brand.budget] || [10000, 50000];
        const targetMid = (target[0] + target[1]) / 2;

        // Fetch influencers (limit to 200 for performance)
        const influencers = await Influencer.find().limit(200).lean();

        function computeScore(inf) {
            const categoryMatch = (inf.category && brand.industry && inf.category.toLowerCase().includes(brand.industry.toLowerCase())) ? 1 : 0;

            const engagement = (typeof inf.engagement === 'number') ? inf.engagement : 0; // percent number
            const engagementScore = Math.min(engagement, 10) / 10; // 0..1

            const followers = (typeof inf.followersCount === 'number') ? inf.followersCount : null;
            let followersScore = 0.5; // default
            if (followers) {
                const diffRatio = Math.abs(followers - targetMid) / targetMid; // 0 = perfect
                followersScore = Math.max(0, 1 - Math.min(diffRatio, 1));
            }

            // Weighted sum: category 40%, engagement 35%, followers 25%
            const score = Math.round((categoryMatch * 0.4 + engagementScore * 0.35 + followersScore * 0.25) * 100);
            return { score, categoryMatch, engagementScore, followersScore };
        }

        const scored = influencers.map(i => {
            const s = computeScore(i);
            return { influencer: i, score: s.score, details: s };
        });

        scored.sort((a, b) => b.score - a.score);

        // Map to client-friendly shape and limit to top 20
        const recommendations = scored.slice(0, 20).map((s, idx) => {
            const inf = s.influencer;
            return {
                id: inf._id,
                name: `${inf.firstName} ${inf.lastName}`,
                handle: `@${inf.instagram}`,
                avatar: null,
                followers: inf.followersCount ? inf.followersCount.toLocaleString() : inf.followers,
                engagement: (typeof inf.engagement === 'number') ? `${inf.engagement}%` : '—',
                niche: inf.category || 'General',
                location: inf.location || 'Unknown',
                rating: 4.5,
                price: inf.followersCount ? `$${Math.max(50, Math.round(inf.followersCount / 1000))}` : '$200',
                platforms: ['instagram'],
                matchScore: s.score,
                audienceMatch: `${Math.min(100, Math.round(s.score * 0.9))}%`,
                brandAlignment: s.details.categoryMatch ? 'Excellent' : 'Good',
                previousWork: [],
                avgViews: null,
                demographics: {},
                recentPosts: [],
                tags: [],
                verified: false,
                responseTime: '< 24 hours',
                campaignFit: `Suitable for ${brand.industry} campaigns`,
                estimatedROI: `${(2 + (s.score / 100)).toFixed(1)}x`
            };
        });

        return res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Recommendation error:', error);
        return res.status(500).json({ message: 'Error computing recommendations', error: error.message });
    }
});

// Get influencer by id (public view)
router.get('/influencers/:influencerId', async (req, res) => {
    const { influencerId } = req.params;
    try {
        const influencer = await Influencer.findById(influencerId).lean();
        if (!influencer) return res.status(404).json({ message: 'Influencer not found' });

        // remove sensitive fields
        delete influencer.password;

        return res.status(200).json({ influencer });
    } catch (error) {
        console.error('Get influencer error:', error);
        return res.status(500).json({ message: 'Error fetching influencer', error: error.message });
    }
});

module.exports = router;
