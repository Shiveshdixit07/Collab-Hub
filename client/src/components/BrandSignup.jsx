import React, { memo } from 'react';
import { Building2, User, Phone, Mail, DollarSign, Lock } from 'lucide-react';

const BrandSignup = memo(function BrandSignup({ form, onChange, onBack, onSuccess }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Join as Brand</h2>
              </div>
              <button 
                onClick={onBack}
                className="text-white hover:text-blue-200 transition-colors"
              >
                ← Back
              </button>
            </div>
            <p className="text-blue-100 mt-2">Connect with the perfect influencers for your brand</p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Awesome Brand Inc."
                    value={form.companyName}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('companyName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={form.contactPerson}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => onChange('contactPerson', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => onChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="contact@awesomebrand.com"
                    value={form.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select 
                    value={form.industry}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="beauty">Beauty & Cosmetics</option>
                    <option value="technology">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="health">Health & Wellness</option>
                    <option value="travel">Travel & Tourism</option>
                    <option value="automotive">Automotive</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select 
                    value={form.companySize}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('companySize', e.target.value)}
                  >
                    <option value="">Select company size</option>
                    <option value="startup">Startup (1-10)</option>
                    <option value="small">Small (11-50)</option>
                    <option value="medium">Medium (51-200)</option>
                    <option value="large">Large (201-1000)</option>
                    <option value="enterprise">Enterprise (1000+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Marketing Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    value={form.budget}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('budget', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="1k-5k">$1K - $5K</option>
                    <option value="5k-10k">$5K - $10K</option>
                    <option value="10k-25k">$10K - $25K</option>
                    <option value="25k-50k">$25K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k+">$100K+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => onChange('password', e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onSuccess}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              >
                Create Brand Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BrandSignup;


