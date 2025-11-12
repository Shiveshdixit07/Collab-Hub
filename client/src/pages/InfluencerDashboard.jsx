import React from 'react';
import { User, Heart, TrendingUp, DollarSign } from 'lucide-react';

const InfluencerDashboard = () => {
  const stats = [
    { label: 'Followers', value: '84,213', icon: <User className="h-5 w-5" />, color: 'from-pink-500 to-purple-600' },
    { label: 'Avg. Likes', value: '3,482', icon: <Heart className="h-5 w-5" />, color: 'from-red-500 to-pink-600' },
    { label: 'Engagement', value: '6.2%', icon: <TrendingUp className="h-5 w-5" />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Earnings (mo)', value: '$2,450', icon: <DollarSign className="h-5 w-5" />, color: 'from-green-500 to-emerald-600' },
  ];

  const campaigns = [
    { id: 1, brand: 'GlowBeauty', status: 'Active', payout: '$300', due: 'Sep 28' },
    { id: 2, brand: 'FitLife', status: 'Review', payout: '$500', due: 'Oct 4' },
    { id: 3, brand: 'TravelPro', status: 'Invited', payout: '$800', due: 'Oct 12' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
          <div className="text-sm text-gray-500">Welcome back, Jane!</div>
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
            {campaigns.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div className="font-medium text-gray-800">{c.brand}</div>
                <div className="text-gray-500">{c.status}</div>
                <div className="text-gray-800">{c.payout}</div>
                <div className="text-gray-500">Due {c.due}</div>
                <button className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Open</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;


