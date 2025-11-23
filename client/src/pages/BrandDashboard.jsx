import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Users, MapPin, Target, DollarSign, Briefcase } from 'lucide-react';

const BrandsDashboard = ({ brand, onLogout }) => {
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

  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsError, setCampaignsError] = useState(null);
  const [recommendedInfluencers, setRecommendedInfluencers] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);
  const [proposalModal, setProposalModal] = useState({ open: false, influencer: null });
  const [proposalForm, setProposalForm] = useState({
    campaignName: '',
    role: '',
    compensation: '',
    timeline: '',
    deliverables: '',
    message: ''
  });
  const [proposalStatus, setProposalStatus] = useState({ sending: false, success: null, error: null });

  // Calculate total influencers across all active campaigns
  const totalActiveInfluencers = activeCampaigns.reduce((sum, campaign) => sum + (campaign.influencers || 0), 0);

  // Calculate total budget utilized from active campaigns (accepted by influencers)
  const totalBudgetUtilized = activeCampaigns.reduce((sum, campaign) => {
    if (campaign.influencerDetails && campaign.influencerDetails.length > 0) {
      const campaignTotal = campaign.influencerDetails.reduce((campaignSum, influencer) => {
        const payoutStr = influencer.payout || '0';
        // Extract numeric value from payout string (handles formats like "$2,500", "2500", "$2500", etc.)
        const payoutMatch = payoutStr.match(/[\d,]+/);
        if (payoutMatch) {
          const payoutNum = parseInt(payoutMatch[0].replace(/,/g, ''), 10);
          if (!isNaN(payoutNum)) {
            return campaignSum + payoutNum;
          }
        }
        return campaignSum;
      }, 0);
      return sum + campaignTotal;
    }
    return sum;
  }, 0);

  // Format budget utilized for display
  const formattedBudgetUtilized = totalBudgetUtilized > 0 
    ? `$${totalBudgetUtilized}` 
    : '$0';
  
  const budgetUtilizedPercentage = brandInfo.budget 
    ? (() => {
        // Try to extract budget range (e.g., "10k-25k" -> use max value 25k)
        const budgetMatch = brandInfo.budget.match(/(\d+)[kK]/);
        if (budgetMatch) {
          const maxBudgetK = parseInt(budgetMatch[1], 10);
          const maxBudget = maxBudgetK * 1000;
          const percentage = maxBudget > 0 ? Math.round((totalBudgetUtilized / maxBudget) * 100) : 0;
          return `${percentage}%`;
        }
        return 'N/A';
      })()
    : 'N/A';

  const stats = [
    { label: "Active Collaborations", value: totalActiveInfluencers.toString(), icon: Users, change: `${activeCampaigns.length} campaigns` },
    { label: "Budget Utilized", value: budgetUtilizedPercentage, icon: DollarSign, change: `${formattedBudgetUtilized} spent` }
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

  useEffect(() => {
    const fetchActiveCampaigns = async () => {
      if (!brand || !brand._id) return;
      setLoadingCampaigns(true);
      setCampaignsError(null);
      try {
        const res = await axios.get(`http://localhost:8080/auth/brands/${brand._id}/campaigns`);
        setActiveCampaigns(res.data.campaigns || []);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
        setCampaignsError('Could not load campaigns');
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchActiveCampaigns();
  }, [brand]);

  const resetProposalForm = () => {
    setProposalForm({
      campaignName: '',
      role: '',
      compensation: '',
      timeline: '',
      deliverables: '',
      message: ''
    });
  };

  const openProposalModal = (influencer) => {
    resetProposalForm();
    setProposalStatus({ sending: false, success: null, error: null });
    setProposalModal({ open: true, influencer });
  };

  const closeProposalModal = () => {
    setProposalModal({ open: false, influencer: null });
  };

  const handleProposalChange = (field, value) => {
    setProposalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (proposalStatus.sending) return;

    if (!brand || !brand._id) {
      setProposalStatus({ sending: false, success: null, error: 'Please log in as a brand to send proposals.' });
      return;
    }

    if (!proposalModal.influencer) {
      setProposalStatus({ sending: false, success: null, error: 'Select an influencer to continue.' });
      return;
    }

    const influencerId = proposalModal.influencer.id || proposalModal.influencer._id;
    if (!influencerId) {
      setProposalStatus({ sending: false, success: null, error: 'Unable to identify influencer. Try refreshing.' });
      return;
    }

    try {
      setProposalStatus({ sending: true, success: null, error: null });
      await axios.post(`http://localhost:8080/auth/brands/${brand._id}/proposals`, {
        influencerId,
        ...proposalForm
      });
      setProposalStatus({ sending: false, success: 'Proposal sent!', error: null });
      setTimeout(() => {
        closeProposalModal();
      }, 1200);
    } catch (err) {
      console.error('Failed to send proposal', err);
      const message = err?.response?.data?.message || 'Could not send proposal. Try again.';
      setProposalStatus({ sending: false, success: null, error: message });
    }
  };

  const navigate = useNavigate();
  const canSendProposal = Boolean(brand && brand._id);

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
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              )}
              
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
          {loadingCampaigns && (
            <div className="text-center py-8 text-gray-500">Loading campaigns...</div>
          )}
          {campaignsError && (
            <div className="text-center py-8 text-red-500">{campaignsError}</div>
          )}
          {!loadingCampaigns && !campaignsError && activeCampaigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active campaigns yet. Send proposals to influencers to get started!
            </div>
          )}
          {!loadingCampaigns && !campaignsError && activeCampaigns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Total Budget</p>
                      <p className="font-medium">{campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Influencers</p>
                      <p className="font-medium">{campaign.influencers}</p>
                    </div>
                  </div>
                  {campaign.influencerDetails && campaign.influencerDetails.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Collaborating Influencers:</p>
                      <div className="space-y-1">
                        {campaign.influencerDetails.map((inf, idx) => (
                          <div key={idx} className="text-xs text-gray-700">
                            {inf.influencerName} ({inf.influencerHandle}) - {inf.payout || 'Negotiable'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
              
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Influencers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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

             
              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{influencer.price}</span> per post
                    <br />
                    {/* <span>⚡ Responds in {influencer.responseTime}</span> */}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/influencer/${influencer.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => openProposalModal(influencer)}
                      disabled={!canSendProposal}
                      title={canSendProposal ? 'Send a proposal to this influencer' : 'Please log in as a brand to send proposals'}
                      className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ${!canSendProposal ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                      Send Proposal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {proposalModal.open && proposalModal.influencer && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Send Proposal To</p>
                <h3 className="text-2xl font-semibold text-gray-900">{proposalModal.influencer.name}</h3>
                <p className="text-gray-500">{proposalModal.influencer.handle}</p>
              </div>
              <button
                type="button"
                onClick={closeProposalModal}
                className="text-gray-500 hover:text-gray-700 rounded-full p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.campaignName}
                    onChange={(e) => handleProposalChange('campaignName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Summer Escape Launch"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Deliverable Type</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.role}
                    onChange={(e) => handleProposalChange('role', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Instagram Reel + Story set"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compensation</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.compensation}
                    onChange={(e) => handleProposalChange('compensation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$2,500 per deliverable"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline / Due Date</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.timeline}
                    onChange={(e) => handleProposalChange('timeline', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Content live by Aug 15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                <textarea
                  value={proposalForm.deliverables}
                  onChange={(e) => handleProposalChange('deliverables', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="List expected deliverables..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                <textarea
                  value={proposalForm.message}
                  onChange={(e) => handleProposalChange('message', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Introduce your campaign and expectations..."
                />
              </div>

              {proposalStatus.error && (
                <p className="text-sm text-red-600">{proposalStatus.error}</p>
              )}
              {proposalStatus.success && (
                <p className="text-sm text-green-600">{proposalStatus.success}</p>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeProposalModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proposalStatus.sending}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${proposalStatus.sending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {proposalStatus.sending ? 'Sending...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsDashboard;