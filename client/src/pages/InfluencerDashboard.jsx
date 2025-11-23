import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User, Heart, TrendingUp, MapPin, Tag, Instagram, LogOut } from 'lucide-react';

const InfluencerDashboard = ({ influencer: influencerProp, onLogout }) => {
  const [influencer, setInfluencer] = useState(influencerProp);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [brandProfiles, setBrandProfiles] = useState({});
  const [profileModal, setProfileModal] = useState({ open: false, brandId: null, loading: false, error: null, profile: null });

  // Load from localStorage if prop is not available (e.g., on page refresh)
  useEffect(() => {
    if (!influencer) {
      const stored = localStorage.getItem('currentInfluencer');
      if (stored) {
        setInfluencer(JSON.parse(stored));
      }
    }
  }, [influencer]);

  const influencerId = influencer?._id;

  const fetchLatestData = useCallback(async () => {
    if (!influencerId) return;
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await axios.get(`http://localhost:8080/auth/influencers/${influencerId}`);
      if (res.data?.influencer) {
        setInfluencer(res.data.influencer);
        localStorage.setItem('currentInfluencer', JSON.stringify(res.data.influencer));
      }
    } catch (err) {
      console.error('Failed to refresh influencer data', err);
      setSyncError('Unable to refresh campaigns. Please try again.');
    } finally {
      setSyncing(false);
    }
  }, [influencerId]);

  useEffect(() => {
    if (influencerId) {
      fetchLatestData();
    }
  }, [influencerId, fetchLatestData]);

  const loadBrandProfile = useCallback(async (brandId) => {
    if (!brandId) return null;
    if (brandProfiles[brandId]) {
      return brandProfiles[brandId];
    }
    const res = await axios.get(`http://localhost:8080/auth/brands/${brandId}/profile`);
    if (res.data?.profile) {
      setBrandProfiles((prev) => ({ ...prev, [brandId]: res.data.profile }));
      return res.data.profile;
    }
    return null;
  }, [brandProfiles]);

  const handleViewBrandProfile = async (brandId) => {
    if (!brandId) return;
    setProfileModal({ open: true, brandId, loading: true, error: null, profile: brandProfiles[brandId] || null });
    try {
      const profile = await loadBrandProfile(brandId);
      setProfileModal({ open: true, brandId, loading: false, error: null, profile });
    } catch (err) {
      console.error('Failed to load brand profile', err);
      const message = err?.response?.data?.message || 'Could not load brand profile.';
      setProfileModal({ open: true, brandId, loading: false, error: message, profile: null });
    }
  };

  const closeProfileModal = () => {
    setProfileModal({ open: false, brandId: null, loading: false, error: null, profile: null });
  };

  // Format followers count for display
  const formatFollowers = (followersRange) => {
    if (!followersRange) return 'N/A';
    return followersRange.toUpperCase().replace('-', ' - ');
  };

  const formatFollowersCount = (inf) => {
    if (!inf) return 'N/A';
    if (typeof inf.followersCount === 'number' && !isNaN(inf.followersCount)) {
      return inf.followersCount.toLocaleString();
    }
    // fallback to range label
    return formatFollowers(inf.followers);
  };

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return 'N/A';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-10 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const fullName = `${influencer.firstName} ${influencer.lastName}`;
  const stats = [
    { label: 'Followers', value: formatFollowersCount(influencer), icon: <User className="h-5 w-5" />, color: 'from-pink-500 to-purple-600' },
    { label: 'Category', value: formatCategory(influencer.category), icon: <Tag className="h-5 w-5" />, color: 'from-red-500 to-pink-600' },
    { label: 'Location', value: influencer.location || 'N/A', icon: <MapPin className="h-5 w-5" />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Instagram', value: `@${influencer.instagram}`, icon: <Instagram className="h-5 w-5" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Avg. Likes', value: influencer.avgLikes ? influencer.avgLikes.toLocaleString() : '—', icon: <Heart className="h-5 w-5" />, color: 'from-red-500 to-pink-600' },
    { label: 'Engagement', value: (typeof influencer.engagement === 'number') ? `${influencer.engagement}%` : '—', icon: <TrendingUp className="h-5 w-5" />, color: 'from-blue-500 to-indigo-600' },
    

  ];

  const campaigns = Array.isArray(influencer?.campaigns) ? influencer.campaigns : [];

  const activeCampaigns = campaigns.filter(c => !['Invited', 'Review'].includes(c.status));

  // Inbox items: invitations sent by brands that influencer can accept/reject
  const inbox = campaigns.filter(c => c.status === 'Invited' || c.status === 'Review');

  const updateCampaignStatus = async (campaignId, action) => {
    if (!influencer || !influencer._id) return;
    try {
      const res = await axios.patch(`http://localhost:8080/auth/influencers/${influencer._id}/campaigns/${campaignId}/respond`, { action });
      if (res.data && res.data.campaigns) {
        const updated = { ...influencer, campaigns: res.data.campaigns };
        setInfluencer(updated);
        localStorage.setItem('currentInfluencer', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to update campaign status', err);
      alert('Could not update campaign. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Welcome back, {influencer.firstName}!</div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-5 bg-white shadow border border-gray-100">
              <div className={`inline-flex items-center justify-center rounded-xl text-white p-2 mb-3 bg-gradient-to-r ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {activeCampaigns.length === 0 && (
              <div className="px-6 py-4 text-gray-500">Accepted campaigns will appear here after you accept an invitation.</div>
            )}
            {activeCampaigns.map((c, idx) => {
              const dueLabel = c.due || (c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD');
              const title = c.campaignName || c.brand || 'Unnamed Campaign';
              return (
                <div key={c._id || idx} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{title}</div>
                    <div className="text-sm text-gray-500">{c.brand}</div>
                  </div>
                  <div className="text-gray-500">{c.status || 'Unknown'}</div>
                  <div className="text-gray-800">{c.payout || '-'}</div>
                  <div className="text-gray-500">Due {dueLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Inbox */}
        <div className="mt-8 bg-white rounded-2xl shadow border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaign Inbox</h2>
              <div className="text-sm text-gray-500">Invitations from brands</div>
              {syncError && <div className="text-sm text-red-500 mt-1">{syncError}</div>}
            </div>
            <button
              onClick={fetchLatestData}
              disabled={syncing || !influencerId}
              className={`text-sm px-3 py-1.5 rounded-lg border ${syncing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {syncing ? 'Refreshing...' : 'Refresh Inbox'}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {inbox.length === 0 && (
              <div className="px-6 py-4 text-gray-500">No new invitations.</div>
            )}
            {inbox.map((c, idx) => {
              const dueLabel = c.due || (c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD');
              const title = c.campaignName || c.brand || 'Campaign Invitation';
              return (
                <div key={c._id || idx} className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="w-full">
                    <div className="font-medium text-gray-800">{title}</div>
                    <div className="text-sm text-gray-500">Role: {c.role || 'Creator'} • Due {dueLabel} • Offer {c.payout || 'N/A'}</div>
                    {c.deliverables && (
                      <div className="text-sm text-gray-600 mt-1">Deliverables: {c.deliverables}</div>
                    )}
                    {c.message && (
                      <div className="text-sm text-gray-600 mt-1 italic">"{c.message}"</div>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewBrandProfile(c.brandId)}
                      disabled={!c.brandId}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${c.brandId ? 'border-indigo-200 text-indigo-600 hover:bg-indigo-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      View Brand Profile
                    </button>
                    <button onClick={() => updateCampaignStatus(c._id || idx, 'accept')} className="text-sm px-3 py-1.5 rounded-lg bg-green-600 text-white">Accept</button>
                    <button onClick={() => updateCampaignStatus(c._id || idx, 'reject')} className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white">Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {profileModal.open && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Brand profile</p>
                <h3 className="text-2xl font-semibold text-gray-900">{profileModal.profile?.companyName || 'Loading brand...'}</h3>
              </div>
              <button
                type="button"
                onClick={closeProfileModal}
                className="text-gray-500 hover:text-gray-700 rounded-full p-2"
              >
                ✕
              </button>
            </div>
            {profileModal.loading && (
              <div className="py-6 text-center text-gray-500">Fetching brand details...</div>
            )}
            {!profileModal.loading && profileModal.error && (
              <div className="py-4 text-red-500 text-sm">{profileModal.error}</div>
            )}
            {!profileModal.loading && profileModal.profile && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-gray-900 font-medium capitalize">{profileModal.profile.industry}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="text-gray-900 font-medium">{profileModal.profile.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{profileModal.profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{profileModal.profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p className="text-gray-900 font-medium capitalize">{profileModal.profile.companySize}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="text-gray-900 font-semibold">${profileModal.profile.budget}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerDashboard;


