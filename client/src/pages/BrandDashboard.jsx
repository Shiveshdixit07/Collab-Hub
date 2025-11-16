import React, { useState } from 'react';
import { Search, Filter, Star, Users, Eye, TrendingUp, MapPin, Instagram, Youtube, Camera, Heart, MessageCircle, Share2, MoreVertical, Bell, Settings, Target, DollarSign, Calendar, Briefcase } from 'lucide-react';

const BrandsDashboard = ({ brand, onLogout }) => {
  const [selectedCampaignType, setSelectedCampaignType] = useState('all');
  const [sortBy, setSortBy] = useState('match_score');
  const [searchTerm, setSearchTerm] = useState('');

  // Use passed brand data or fallback to default
  const brandInfo = brand || {
    companyName: "Demo Company",
    contactPerson: "Demo User",
    email: "demo@company.com",
    industry: "technology",
    companySize: "medium",
    budget: "10k-25k"
  };

  // Current campaigns
  const activeCampaigns = [
    {
      id: 1,
      name: "Bali Adventure Package",
      budget: "$15,000",
      duration: "30 days",
      status: "active",
      influencers: 3,
      reach: "450K"
    },
    {
      id: 2,
      name: "European Backpacking",
      budget: "$8,000",
      duration: "45 days",
      status: "planning",
      influencers: 2,
      reach: "280K"
    }
  ];

  // Recommended influencers with match scores for Wanderlust Tours
  const recommendedInfluencers = [
    {
      id: 1,
      name: "Sarah Adventures",
      handle: "@sarah_adventures",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face",
      followers: "245K",
      engagement: "4.8%",
      niche: "Adventure Travel",
      location: "Bali, Indonesia",
      rating: 4.9,
      price: "$500-800",
      platforms: ["instagram", "youtube"],
      matchScore: 96,
      audienceMatch: "92%",
      brandAlignment: "Excellent",
      previousWork: ["Adventure Co.", "Mountain Gear"],
      avgViews: "85K",
      demographics: { age: "25-34", gender: "55% Female", location: "US, Europe, Asia" },
      recentPosts: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop"
      ],
      tags: ["Adventure", "Solo Travel", "Nature", "Photography"],
      verified: true,
      responseTime: "< 2 hours",
      campaignFit: "Perfect for Bali Adventure Package",
      estimatedROI: "4.2x"
    },
    {
      id: 2,
      name: "Travel Couple",
      handle: "@wanderlust_duo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      followers: "180K",
      engagement: "5.2%",
      niche: "Couple Travel",
      location: "Paris, France",
      rating: 4.7,
      price: "$400-650",
      platforms: ["instagram"],
      matchScore: 89,
      audienceMatch: "87%",
      brandAlignment: "Very Good",
      previousWork: ["Romantic Getaways", "Luxury Hotels"],
      avgViews: "62K",
      demographics: { age: "28-40", gender: "65% Female", location: "US, Europe" },
      recentPosts: [
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1549144511-f099e773c147?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1520637836862-4d197d17c0a7?w=100&h=100&fit=crop"
      ],
      tags: ["Romance", "Europe", "Food", "Culture"],
      verified: false,
      responseTime: "< 4 hours",
      campaignFit: "Great for European Packages",
      estimatedROI: "3.8x"
    },
    {
      id: 3,
      name: "Budget Explorer",
      handle: "@budget_nomad",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      followers: "320K",
      engagement: "3.9%",
      niche: "Budget Travel",
      location: "Bangkok, Thailand",
      rating: 4.6,
      price: "$300-500",
      platforms: ["instagram", "youtube"],
      matchScore: 84,
      audienceMatch: "81%",
      brandAlignment: "Good",
      previousWork: ["Hostel World", "Budget Airlines"],
      avgViews: "95K",
      demographics: { age: "22-30", gender: "48% Female", location: "Global" },
      recentPosts: [
        "https://images.unsplash.com/photo-1528181304800-259b08848526?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop"
      ],
      tags: ["Budget", "Backpacking", "Southeast Asia", "Tips"],
      verified: true,
      responseTime: "< 1 hour",
      campaignFit: "Ideal for Budget Campaigns",
      estimatedROI: "5.1x"
    },
    {
      id: 4,
      name: "Solo Female Traveler",
      handle: "@solo_she_travels",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      followers: "210K",
      engagement: "5.7%",
      niche: "Solo Female Travel",
      location: "Tokyo, Japan",
      rating: 4.9,
      price: "$450-700",
      platforms: ["instagram", "youtube"],
      matchScore: 91,
      audienceMatch: "89%",
      brandAlignment: "Excellent",
      previousWork: ["Solo Travel Co.", "Safety First"],
      avgViews: "78K",
      demographics: { age: "25-35", gender: "78% Female", location: "US, Europe, Asia" },
      recentPosts: [
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1528164344705-47542687000d?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&h=100&fit=crop"
      ],
      tags: ["Solo Travel", "Safety", "Culture", "Empowerment"],
      verified: true,
      responseTime: "< 2 hours",
      campaignFit: "Perfect for Solo Travel Packages",
      estimatedROI: "4.5x"
    }
  ];

  const stats = [
    { label: "Campaign Performance", value: "4.2x ROI", icon: TrendingUp, change: "+15%" },
    { label: "Active Collaborations", value: "8", icon: Users, change: "+3" },
    { label: "Total Reach This Month", value: "2.1M", icon: Eye, change: "+22%" },
    { label: "Budget Utilized", value: "68%", icon: DollarSign, change: "$34K spent" }
  ];

  const campaignTypes = [
    "Adventure Tours",
    "Cultural Experiences",
    "Budget Packages",
    "Luxury Escapes",
    "Solo Travel",
    "Group Tours"
  ];

  const filteredInfluencers = recommendedInfluencers.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{brandInfo.companyName}</h1>
                <p className="text-gray-600">Find perfect influencers for your campaigns</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              )}
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                New Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Brand Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome back, {brandInfo.contactPerson}!</h2>
              <p className="text-blue-100">Ready to find amazing influencers for your {brandInfo.industry} campaigns?</p>
              <div className="mt-3 text-sm text-blue-100">
                <span>Company Size: {brandInfo.companySize} • Budget Range: ${brandInfo.budget}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${brandInfo.budget}</div>
              <div className="text-blue-100">Budget Range</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Campaigns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-medium">{campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Influencers</p>
                    <p className="font-medium">{campaign.influencers}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reach</p>
                    <p className="font-medium">{campaign.reach}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Influencers</h3>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recommended influencers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCampaignType}
                onChange={(e) => setSelectedCampaignType(e.target.value)}
              >
                <option value="all">All Campaign Types</option>
                {campaignTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="match_score">Best Match</option>
                  <option value="engagement">Highest Engagement</option>
                  <option value="followers">Most Followers</option>
                  <option value="roi">Best ROI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Influencers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Match Score Badge */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">{influencer.matchScore}% Match</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{influencer.brandAlignment}</span>
                </div>
              </div>

              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {influencer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{influencer.name}</h3>
                      <p className="text-gray-600">{influencer.handle}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{influencer.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Fit */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{influencer.campaignFit}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{influencer.followers}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{influencer.engagement}</p>
                    <p className="text-xs text-gray-600">Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{influencer.audienceMatch}</p>
                    <p className="text-xs text-gray-600">Audience Match</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{influencer.estimatedROI}</p>
                    <p className="text-xs text-gray-600">Est. ROI</p>
                  </div>
                </div>
              </div>

              {/* Previous Brand Work */}
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Brand Collaborations</h4>
                <div className="flex space-x-2">
                  {influencer.previousWork.map((brand, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Content */}
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Content</h4>
                <div className="flex space-x-2">
                  {influencer.recentPosts.map((post, index) => (
                    <img
                      key={index}
                      src={post}
                      alt={`Recent post ${index + 1}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{influencer.price}</span> per post
                    <br />
                    <span>⚡ Responds in {influencer.responseTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Profile
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Send Proposal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            View More Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandsDashboard;