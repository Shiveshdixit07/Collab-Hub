import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Heart, TrendingUp, MapPin, ArrowLeft } from 'lucide-react';

const InfluencerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [influencer, setInfluencer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfluencer = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:8080/auth/influencers/${id}`);
                setInfluencer(res.data.influencer);
            } catch (err) {
                console.error('Failed to fetch influencer', err);
                setError('Could not load influencer profile');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchInfluencer();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!influencer) return <div className="p-8">Influencer not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-md bg-gray-100">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{influencer.firstName} {influencer.lastName}</h1>
                        <div className="text-sm text-gray-500">@{influencer.instagram} • {influencer.category}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="sm:col-span-1">
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <User className="mx-auto w-12 h-12 text-gray-500" />
                            <div className="mt-3 text-lg font-semibold">{influencer.followersCount ? influencer.followersCount.toLocaleString() : influencer.followers}</div>
                            <div className="text-sm text-gray-500">Followers</div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <Heart className="mx-auto w-6 h-6 text-red-500" />
                                <div className="mt-2 font-semibold">{influencer.avgLikes ? influencer.avgLikes.toLocaleString() : '—'}</div>
                                <div className="text-sm text-gray-500">Avg. Likes</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <TrendingUp className="mx-auto w-6 h-6 text-blue-500" />
                                <div className="mt-2 font-semibold">{(typeof influencer.engagement === 'number') ? `${influencer.engagement}%` : '—'}</div>
                                <div className="text-sm text-gray-500">Engagement</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <MapPin className="mx-auto w-6 h-6 text-green-500" />
                                <div className="mt-2 font-semibold">{influencer.location || '—'}</div>
                                <div className="text-sm text-gray-500">Location</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Campaigns</h3>
                    <div className="divide-y divide-gray-100 rounded-lg border">
                        {influencer.campaigns && influencer.campaigns.length ? (
                            influencer.campaigns.map((c) => (
                                <div key={c._id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{c.brand || 'Unnamed'}</div>
                                        <div className="text-sm text-gray-500">Role: {c.role || 'Creator'}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">{c.status}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-gray-500">No campaigns yet.</div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">Category: {influencer.category}</p>
                    <p className="text-gray-700">Instagram: <a className="text-blue-600" href={`https://instagram.com/${influencer.instagram}`} target="_blank" rel="noreferrer">@{influencer.instagram}</a></p>
                </div>
            </div>
        </div>
    );
};

export default InfluencerProfile;
