import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeView from './components/HomeView';
import InfluencerSignup from './components/InfluencerSignup';
import BrandSignup from './components/BrandSignup';
import InfluencerDashboard from './pages/InfluencerDashboard';
import BrandDashboard from './pages/BrandDashboard';

const InfluencerPlatform = () => {
  const [currentView, setCurrentView] = useState('home');
  const [influencerForm, setInfluencerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    followers: '',
    category: '',
    location: '',
    password: ''
  });
  const [brandForm, setBrandForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    industry: '',
    companySize: '',
    budget: '',
    password: ''
  });

  const handleInfluencerInputChange = (field, value) => {
    setInfluencerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandInputChange = (field, value) => {
    setBrandForm(prev => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();

  const handleInfluencerSignupSuccess = () => {
    navigate('/influencer');
  };

  const handleBrandSignupSuccess = () => {
    navigate('/brand');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeView
            onGotoInfluencer={() => navigate('/signup/influencer')}
            onGotoBrand={() => navigate('/signup/brand')}
          />
        }
      />
      <Route
        path="/signup/influencer"
        element={
          <InfluencerSignup
            form={influencerForm}
            onChange={handleInfluencerInputChange}
            onBack={() => navigate('/')}
            onSuccess={handleInfluencerSignupSuccess}
          />
        }
      />
      <Route
        path="/signup/brand"
        element={
          <BrandSignup
            form={brandForm}
            onChange={handleBrandInputChange}
            onBack={() => navigate('/')}
            onSuccess={handleBrandSignupSuccess}
          />
        }
      />
      <Route path="/influencer" element={<InfluencerDashboard />} />
      <Route path="/brand" element={<BrandDashboard />} />
    </Routes>
  );
};

export default InfluencerPlatform;

 
