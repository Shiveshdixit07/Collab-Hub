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

router.get('/brands/:brandId/recommendations', async (req, res) => {
    const { brandId } = req.params;
    try {
        const brand = await Brand.findById(brandId);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        // Industry category mapping for semantic matching
        const industryKeywords = {
            'fashion': ['fashion', 'style', 'clothing', 'apparel', 'outfit', 'wardrobe', 'trend'],
            'beauty': ['beauty', 'makeup', 'cosmetic', 'skincare', 'glam', 'aesthetic'],
            'technology': ['tech', 'technology', 'gadget', 'digital', 'innovation', 'software', 'app'],
            'food': ['food', 'recipe', 'cooking', 'culinary', 'restaurant', 'dining', 'chef'],
            'health': ['health', 'fitness', 'wellness', 'workout', 'nutrition', 'yoga', 'gym'],
            'travel': ['travel', 'tourism', 'adventure', 'wanderlust', 'destination', 'vacation'],
            'automotive': ['car', 'automotive', 'vehicle', 'auto', 'driving', 'motor'],
            'other': []
        };

        // Budget to optimal follower range mapping (for better targeting)
        const budgetTargets = {
            '1k-5k': { min: 1000, max: 50000, optimal: 10000 },
            '5k-10k': { min: 5000, max: 100000, optimal: 30000 },
            '10k-25k': { min: 10000, max: 500000, optimal: 100000 },
            '25k-50k': { min: 50000, max: 1000000, optimal: 300000 },
            '50k-100k': { min: 100000, max: 2000000, optimal: 750000 },
            '100k+': { min: 500000, max: 1000000000, optimal: 20000000 }
        };

        const budgetConfig = budgetTargets[brand.budget] || budgetTargets['10k-25k'];

        // Fetch all influencers
        const influencers = await Influencer.find().lean();

        // Calculate normalization factors for engagement and followers
        const engagements = influencers
            .map(inf => typeof inf.engagement === 'number' ? inf.engagement : 0)
            .filter(e => e > 0);
        const maxEngagement = engagements.length > 0 ? Math.max(...engagements) : 10;
        const avgEngagement = engagements.length > 0 
            ? engagements.reduce((a, b) => a + b, 0) / engagements.length 
            : 5;

        const followers = influencers
            .map(inf => typeof inf.followersCount === 'number' ? inf.followersCount : 0)
            .filter(f => f > 0);
        const maxFollowers = followers.length > 0 ? Math.max(...followers) : 1000000;

        // Industry keywords for semantic matching
        const brandKeywords = industryKeywords[brand.industry] || [];

        /**
         * Advanced Multi-Factor Scoring Algorithm
         * Uses weighted ensemble of multiple signals
         */
        function computeAdvancedScore(inf) {
            // 1. Industry/Category Match Score (0-1) - 30% weight
            let categoryScore = 0;
            if (inf.category && brand.industry) {
                const catLower = inf.category.toLowerCase();
                const indLower = brand.industry.toLowerCase();
                
                // Exact match
                if (catLower === indLower) {
                    categoryScore = 1.0;
                }
                // Contains match
                else if (catLower.includes(indLower) || indLower.includes(catLower)) {
                    categoryScore = 0.8;
                }
                // Keyword-based semantic match
                else {
                    const keywordMatch = brandKeywords.some(keyword => 
                        catLower.includes(keyword.toLowerCase())
                    );
                    categoryScore = keywordMatch ? 0.6 : 0.2;
                }
            }

            // 2. Engagement Quality Score (0-1) - 25% weight
            // Normalized engagement rate with bonus for high engagement
            let engagementScore = 0.5; // default
            if (typeof inf.engagement === 'number' && inf.engagement > 0) {
                // Normalize to 0-1 range, with bonus for above-average engagement
                const normalized = Math.min(inf.engagement / maxEngagement, 1);
                const aboveAvgBonus = inf.engagement > avgEngagement ? 0.2 : 0;
                engagementScore = Math.min(1, normalized + aboveAvgBonus);
            }

            // 3. Follower Reach Score (0-1) - 20% weight
            // Optimal range matching with Gaussian-like distribution
            let followersScore = 0.3; // default
            if (typeof inf.followersCount === 'number' && inf.followersCount > 0) {
                const followers = inf.followersCount;
                
                // Check if within acceptable range
                if (followers >= budgetConfig.min && followers <= budgetConfig.max) {
                    // Calculate distance from optimal (closer = better)
                    const distanceFromOptimal = Math.abs(followers - budgetConfig.optimal);
                    const maxDistance = budgetConfig.max - budgetConfig.min;
                    const normalizedDistance = Math.min(distanceFromOptimal / maxDistance, 1);
                    
                    // Gaussian-like scoring (closer to optimal = higher score)
                    followersScore = Math.max(0.5, 1 - (normalizedDistance * 0.5));
                } else if (followers < budgetConfig.min) {
                    // Too small, but still give some credit
                    followersScore = 0.2;
                } else {
                    // Too large, but might still be valuable
                    followersScore = 0.4;
                }
            }

            // 4. Content Quality Score (0-1) - 10% weight
            // Based on average likes normalized by followers
            let contentQualityScore = 0.5;
            if (typeof inf.avgLikes === 'number' && inf.avgLikes > 0 && 
                typeof inf.followersCount === 'number' && inf.followersCount > 0) {
                const likesPerFollower = inf.avgLikes / inf.followersCount;
                // Good engagement is typically 1-5% likes per follower
                contentQualityScore = Math.min(1, likesPerFollower * 20); // Scale to 0-1
            }

            // 5. Historical Performance Score (0-1) - 10% weight
            // Based on completed vs total campaigns
            let performanceScore = 0.5;
            if (inf.campaigns && Array.isArray(inf.campaigns)) {
                const totalCampaigns = inf.campaigns.length;
                const completedCampaigns = inf.campaigns.filter(c => c.status === 'Completed').length;
                const activeCampaigns = inf.campaigns.filter(c => c.status === 'Active').length;
                
                if (totalCampaigns > 0) {
                    // Completion rate
                    const completionRate = completedCampaigns / totalCampaigns;
                    // Active rate (shows they accept offers)
                    const activeRate = activeCampaigns / totalCampaigns;
                    performanceScore = (completionRate * 0.6) + (activeRate * 0.4);
                }
            }

            // 6. Availability Score (0-1) - 5% weight
            // Prefer influencers with fewer active campaigns (more available)
            let availabilityScore = 0.7; // default
            if (inf.campaigns && Array.isArray(inf.campaigns)) {
                const activeCount = inf.campaigns.filter(c => c.status === 'Active').length;
                // Fewer active campaigns = more available
                availabilityScore = Math.max(0.3, 1 - (activeCount * 0.2));
            }

            // Weighted ensemble scoring
            const finalScore = (
                categoryScore * 0.35 +      // Industry match
                engagementScore * 0.05 +    // Engagement quality
                followersScore * 0.30 +     // Follower reach
                contentQualityScore * 0.10 + // Content quality
                performanceScore * 0.10 +    // Historical performance
                availabilityScore * 0.05     // Availability
            );

            return {
                score: Math.round(finalScore * 100),
                categoryScore,
                engagementScore,
                followersScore,
                contentQualityScore,
                performanceScore,
                availabilityScore
            };
        }

        // Score all influencers
        const scored = influencers.map(i => {
            const s = computeAdvancedScore(i);
            return { influencer: i, score: s.score, details: s };
        });

        // Sort by score (descending)
        scored.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            // Tie-breaker: prefer higher engagement
            const aEng = typeof a.influencer.engagement === 'number' ? a.influencer.engagement : 0;
            const bEng = typeof b.influencer.engagement === 'number' ? b.influencer.engagement : 0;
            return bEng - aEng;
        });

        // Map to client-friendly shape and limit to top 30 (increased for better selection)
        const recommendations = scored.slice(0, 30).map((s, idx) => {
            const inf = s.influencer;
            
            // Calculate estimated price based on followers and engagement
            let estimatedPrice = 200;
            if (typeof inf.followersCount === 'number' && inf.followersCount > 0) {
                // Base price: $1 per 1000 followers, adjusted by engagement
                const basePrice = inf.followersCount / 1000;
                const engagementMultiplier = typeof inf.engagement === 'number' && inf.engagement > 0
                    ? 1 + (inf.engagement / 10) // Higher engagement = higher price
                    : 1;
                estimatedPrice = Math.max(50, Math.round(basePrice * engagementMultiplier));
            }

            // Determine brand alignment level
            let brandAlignment = 'Good';
            if (s.details.categoryScore >= 0.8) brandAlignment = 'Excellent';
            else if (s.details.categoryScore >= 0.6) brandAlignment = 'Very Good';
            else if (s.details.categoryScore >= 0.4) brandAlignment = 'Good';

            // Calculate estimated ROI (higher engagement and match = better ROI)
            const roiBase = 2.0;
            const roiBoost = (s.details.categoryScore * 0.5) + (s.details.engagementScore * 0.3);
            const estimatedROI = (roiBase + roiBoost).toFixed(1);

            // Extract previous brand collaborations
            const previousWork = [];
            if (inf.campaigns && Array.isArray(inf.campaigns)) {
                const uniqueBrands = new Set();
                inf.campaigns.forEach(campaign => {
                    if (campaign.brand && campaign.status === 'Completed') {
                        uniqueBrands.add(campaign.brand);
                    }
                });
                previousWork.push(...Array.from(uniqueBrands).slice(0, 5));
            }

            return {
                id: inf._id,
                name: `${inf.firstName} ${inf.lastName}`,
                handle: `@${inf.instagram}`,
                avatar: null,
                followers: inf.followersCount ? inf.followersCount.toLocaleString() : inf.followers,
                engagement: (typeof inf.engagement === 'number') ? `${inf.engagement.toFixed(1)}%` : '—',
                niche: inf.category || 'General',
                location: inf.location || 'Unknown',
                rating: 4.5 + (s.score / 200), // Dynamic rating based on score
                price: `$${estimatedPrice}`,
                platforms: ['instagram'],
                matchScore: s.score,
                audienceMatch: `${Math.min(100, Math.round(s.score * 0.95))}%`,
                brandAlignment: brandAlignment,
                previousWork: previousWork,
                avgViews: inf.avgLikes ? inf.avgLikes.toLocaleString() : null,
                demographics: {},
                recentPosts: [],
                tags: inf.category ? [inf.category] : [],
                verified: false,
                responseTime: '< 24 hours',
                campaignFit: `Suitable for ${brand.industry} campaigns`,
                estimatedROI: `${estimatedROI}x`
            };
        });

        return res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Recommendation error:', error);
        return res.status(500).json({ message: 'Error computing recommendations', error: error.message });
    }
});

// Send proposal from brand to influencer (adds entry to influencer inbox)
router.post('/brands/:brandId/proposals', async (req, res) => {
    const { brandId } = req.params;
    const { influencerId, campaignName, role, compensation, timeline, deliverables, message } = req.body;

    if (!influencerId) {
        return res.status(400).json({ message: 'influencerId is required' });
    }

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        const influencer = await Influencer.findById(influencerId);
        if (!influencer) return res.status(404).json({ message: 'Influencer not found' });

        const sanitize = (value) => typeof value === 'string' ? value.trim() : '';

        const proposal = {
            brand: brand.companyName,
            brandId: brand._id,
            campaignName: sanitize(campaignName) || `${brand.companyName} Collaboration`,
            role: sanitize(role) || 'Creator',
            payout: sanitize(compensation) || 'Negotiable',
            due: sanitize(timeline) || 'TBD',
            deliverables: sanitize(deliverables),
            message: sanitize(message),
            status: 'Invited'
        };

        influencer.campaigns.push(proposal);
        await influencer.save();

        const savedProposal = influencer.campaigns[influencer.campaigns.length - 1];

        return res.status(201).json({
            message: 'Proposal sent successfully',
            campaign: savedProposal,
            campaigns: influencer.campaigns
        });
    } catch (error) {
        console.error('Proposal send error:', error);
        return res.status(500).json({ message: 'Error sending proposal', error: error.message });
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

// Public brand profile for influencers to view
router.get('/brands/:brandId/profile', async (req, res) => {
    const { brandId } = req.params;
    try {
        const brand = await Brand.findById(brandId).lean();
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        const profile = {
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

        return res.status(200).json({ profile });
    } catch (error) {
        console.error('Brand profile fetch error:', error);
        return res.status(500).json({ message: 'Error fetching brand profile', error: error.message });
    }
});

// Get accepted campaigns for a brand
router.get('/brands/:brandId/campaigns', async (req, res) => {
    const { brandId } = req.params;
    try {
        const brand = await Brand.findById(brandId);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });

        // Find all influencers with campaigns from this brand that are accepted (status: 'Active')
        const influencers = await Influencer.find({
            'campaigns.brandId': brandId,
            'campaigns.status': 'Active'
        }).lean();

        // Extract and group campaigns by campaignName
        const campaignMap = new Map();

        influencers.forEach(influencer => {
            influencer.campaigns.forEach(campaign => {
                if (campaign.brandId && campaign.brandId.toString() === brandId && campaign.status === 'Active') {
                    const campaignName = campaign.campaignName || `${brand.companyName} Collaboration`;
                    
                    if (!campaignMap.has(campaignName)) {
                        campaignMap.set(campaignName, {
                            campaignName,
                            influencers: [],
                            totalPayout: 0,
                            status: 'active'
                        });
                    }

                    const campaignData = campaignMap.get(campaignName);
                    campaignData.influencers.push({
                        influencerId: influencer._id,
                        influencerName: `${influencer.firstName} ${influencer.lastName}`,
                        influencerHandle: `@${influencer.instagram}`,
                        payout: campaign.payout,
                        due: campaign.due,
                        role: campaign.role,
                        deliverables: campaign.deliverables
                    });

                    // Try to parse payout for total calculation
                    const payoutStr = campaign.payout || '0';
                    const payoutMatch = payoutStr.match(/[\d,]+/);
                    if (payoutMatch) {
                        const payoutNum = parseInt(payoutMatch[0].replace(/,/g, ''), 10);
                        if (!isNaN(payoutNum)) {
                            campaignData.totalPayout += payoutNum;
                        }
                    }
                }
            });
        });

        // Convert map to array
        const campaigns = Array.from(campaignMap.values()).map(campaign => ({
            id: campaign.campaignName,
            name: campaign.campaignName,
            budget: campaign.totalPayout > 0 ? `$${campaign.totalPayout.toLocaleString()}` : 'TBD',
            influencers: campaign.influencers.length,
            status: campaign.status,
            influencerDetails: campaign.influencers
        }));

        return res.status(200).json({ campaigns });
    } catch (error) {
        console.error('Get brand campaigns error:', error);
        return res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
});

module.exports = router;
