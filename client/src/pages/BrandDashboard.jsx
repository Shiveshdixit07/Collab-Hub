import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  const [recommendedInfluencers, setRecommendedInfluencers] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);

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
    (influencer.niche || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (influencer.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!brand || !brand._id) return;
      setLoadingRecs(true);
      setRecError(null);
      try {
        const res = await axios.get(`http://localhost:8080/auth/brands/${brand._id}/recommendations`);
        setRecommendedInfluencers(res.data.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
        setRecError('Could not load recommendations');
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, [brand]);

  const navigate = useNavigate();

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
                    <button onClick={() => navigate(`/influencer/${influencer.id}`)} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
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