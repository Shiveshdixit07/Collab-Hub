import React, { memo } from 'react';
import { Building2, Mail, Lock, ArrowLeft } from 'lucide-react';

const BrandLogin = memo(function BrandLogin({ form, onChange, onBack, onSubmit, isSubmitting, error }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Building2 className="h-8 w-8 text-white" />
                                <h2 className="text-3xl font-bold text-white">Brand Login</h2>
                            </div>
                            <button
                                onClick={onBack}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-blue-100 mt-2">Access your brand dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="contact@yourbrand.com"
                                        value={form.email}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        onChange={(e) => onChange('email', e.target.value)}
                                        required
                                    />
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
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${isSubmitting
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                                    }`}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
                            </button>

                            <div className="text-center text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/signup/brand'}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign up here
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default BrandLogin;