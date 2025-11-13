import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeView from './components/HomeView';
import InfluencerSignup from './components/InfluencerSignup';
import InfluencerLogin from './components/InfluencerLogin';
import BrandSignup from './components/BrandSignup';
import InfluencerDashboard from './pages/InfluencerDashboard';
import BrandDashboard from './pages/BrandDashboard';
import axios from 'axios';
const InfluencerPlatform = () => {
  const location = useLocation();

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

  const [influencerLoginForm, setInfluencerLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentInfluencer, setCurrentInfluencer] = useState(null);

  // Load influencer from localStorage on mount (for page refresh)
  useEffect(() => {
    const stored = localStorage.getItem('currentInfluencer');
    if (stored) {
      try {
        setCurrentInfluencer(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored influencer data:', error);
        localStorage.removeItem('currentInfluencer');
      }
    }
  }, []);

  // Clear login form when navigating to login page
  useEffect(() => {
    if (location.pathname === '/login/influencer') {
      setInfluencerLoginForm({ email: '', password: '' });
      setLoginError('');
    }
  }, [location.pathname]);

  const handleInfluencerInputChange = (field, value) => {
    setInfluencerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandInputChange = (field, value) => {
    setBrandForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInfluencerLoginChange = (field, value) => {
    setInfluencerLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();

  const handleInfluencerSignupSuccess = async() => {
    try{
      const response=await axios.post('http://localhost:8080/auth/signup/influencers',influencerForm);
      console.log(response.data);
      navigate('/login/influencer');
    }catch(error){
      console.error('Error signing up influencer:', error);
    }
  };

  const handleBrandSignupSuccess = () => {
    navigate('/brand');
  };

  const handleInfluencerLoginSubmit = async () => {
    try {
      setIsLoggingIn(true);
      setLoginError('');
      const response = await axios.post('http://localhost:8080/auth/login/influencers', influencerLoginForm);
      console.log(response.data);
      // Store influencer data in state
      if (response.data.influencer) {
        setCurrentInfluencer(response.data.influencer);
        // Also store in localStorage for persistence
        localStorage.setItem('currentInfluencer', JSON.stringify(response.data.influencer));
      }
      // Clear login form after successful login
      setInfluencerLoginForm({ email: '', password: '' });
      navigate('/influencer');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to log in. Please try again.';
      setLoginError(message);
      console.error('Error logging in influencer:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInfluencerLogout = () => {
    setCurrentInfluencer(null);
    localStorage.removeItem('currentInfluencer');
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeView
            onGotoInfluencer={() => navigate('/signup/influencer')}
            onGotoBrand={() => navigate('/signup/brand')}
            onGotoInfluencerLogin={() => navigate('/login/influencer')}
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
        path="/login/influencer"
        element={
          <InfluencerLogin
            form={influencerLoginForm}
            onChange={handleInfluencerLoginChange}
            onBack={() => navigate('/')}
            onSubmit={handleInfluencerLoginSubmit}
            isSubmitting={isLoggingIn}
            error={loginError}
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
      <Route path="/influencer" element={<InfluencerDashboard influencer={currentInfluencer} onLogout={handleInfluencerLogout} />} />
      <Route path="/brand" element={<BrandDashboard />} />
    </Routes>
  );
};

export default InfluencerPlatform;

 
