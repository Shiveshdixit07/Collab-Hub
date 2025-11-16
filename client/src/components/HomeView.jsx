import React, { memo } from 'react';
import { TrendingUp, Users, Building2, Instagram, Star, DollarSign } from 'lucide-react';

const HomeView = memo(function HomeView({ onGotoInfluencer, onGotoBrand, onGotoInfluencerLogin, onGotoBrandLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">CollabHub</h1>
          </div>
          <div className="flex space-x-4">
            <button className="text-white hover:text-purple-300 transition-colors">About</button>
            <button className="text-white hover:text-purple-300 transition-colors">Features</button>
            <button className="text-white hover:text-purple-300 transition-colors">Contact</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Connect <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Brands</span> with
            <br />Perfect <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Influencers</span>
          </h1>
          <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">
            The ultimate platform where brands discover authentic influencers and creators find their perfect collaboration partners.
            Get the best deals, maximize your reach, and build meaningful partnerships.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-purple-300">Active Influencers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2K+</div>
              <div className="text-purple-300">Partner Brands</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-purple-300">Successful Collaborations</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onGotoInfluencer}
              className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
            >
              <Users className="h-6 w-6" />
              <span>Join as Influencer</span>
            </button>
            <button
              onClick={onGotoBrand}
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
            >
              <Building2 className="h-6 w-6" />
              <span>Join as Brand</span>
            </button>
          </div>

          {/* Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={onGotoInfluencerLogin}
              className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 border border-white/30"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Influencer Login</span>
            </button>
            <button
              onClick={onGotoBrandLogin}
              className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 border border-white/30"
            >
              <Building2 className="h-5 w-5" />
              <span>Brand Login</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Instagram className="h-12 w-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Instagram Integration</h3>
            <p className="text-purple-200">Direct integration with Instagram analytics and metrics</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Star className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
            <p className="text-purple-200">AI-powered algorithm to find perfect collaboration matches</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <DollarSign className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Fair Pricing</h3>
            <p className="text-purple-200">Transparent pricing with market-rate recommendations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <TrendingUp className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-purple-200">Comprehensive performance tracking and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HomeView;


