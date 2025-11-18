import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Heart, TrendingUp, DollarSign, MapPin, Tag, Instagram, LogOut } from 'lucide-react';

const InfluencerDashboard = ({ influencer: influencerProp, onLogout }) => {
  const [influencer, setInfluencer] = useState(influencerProp);

  // Load from localStorage if prop is not available (e.g., on page refresh)
  useEffect(() => {
    if (!influencer) {
      const stored = localStorage.getItem('currentInfluencer');
      if (stored) {
        setInfluencer(JSON.parse(stored));
      }
    }
  }, [influencer]);

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
    { label: 'Earnings (mo)', value: '$2,450', icon: <DollarSign className="h-5 w-5" />, color: 'from-green-500 to-emerald-600' },

  ];

  const campaigns = (influencer && influencer.campaigns && influencer.campaigns.length)
    ? influencer.campaigns
    : [];

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
            <button className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {campaigns.map((c, idx) => {
              const dueLabel = c.due || (c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD');
              return (
                <div key={c._id || idx} className="px-6 py-4 flex items-center justify-between">
                  <div className="font-medium text-gray-800">{c.brand || 'Unnamed Campaign'}</div>
                  <div className="text-gray-500">{c.status || 'Unknown'}</div>
                  <div className="text-gray-800">{c.payout || '-'}</div>
                  <div className="text-gray-500">Due {dueLabel}</div>
                  <button className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Open</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Inbox */}
        <div className="mt-8 bg-white rounded-2xl shadow border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Campaign Inbox</h2>
            <div className="text-sm text-gray-500">Invitations from brands</div>
          </div>
          <div className="divide-y divide-gray-100">
            {inbox.length === 0 && (
              <div className="px-6 py-4 text-gray-500">No new invitations.</div>
            )}
            {inbox.map((c, idx) => {
              const dueLabel = c.due || (c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD');
              return (
                <div key={c._id || idx} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{c.brand || 'Unnamed Campaign'}</div>
                    <div className="text-sm text-gray-500">Role: {c.role || 'Creator'} • Due {dueLabel}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateCampaignStatus(c._id || idx, 'accept')} className="text-sm px-3 py-1.5 rounded-lg bg-green-600 text-white">Accept</button>
                    <button onClick={() => updateCampaignStatus(c._id || idx, 'reject')} className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white">Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;


