import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeView from './components/HomeView';
import InfluencerSignup from './components/InfluencerSignup';
import InfluencerLogin from './components/InfluencerLogin';
import BrandSignup from './components/BrandSignup';
import BrandLogin from './components/BrandLogin';
import InfluencerDashboard from './pages/InfluencerDashboard';
import BrandDashboard from './pages/BrandDashboard';
import InfluencerProfile from './pages/InfluencerProfile';
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
  const [brandLoginForm, setBrandLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isBrandLoggingIn, setIsBrandLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [brandLoginError, setBrandLoginError] = useState('');
  const [currentInfluencer, setCurrentInfluencer] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [influencerSignupError, setInfluencerSignupError] = useState('');

  // Load influencer and brand from localStorage on mount (for page refresh)
  useEffect(() => {
    const storedInfluencer = localStorage.getItem('currentInfluencer');
    const storedBrand = localStorage.getItem('currentBrand');

    if (storedInfluencer) {
      try {
        setCurrentInfluencer(JSON.parse(storedInfluencer));
      } catch (error) {
        console.error('Error parsing stored influencer data:', error);
        localStorage.removeItem('currentInfluencer');
      }
    }

    if (storedBrand) {
      try {
        setCurrentBrand(JSON.parse(storedBrand));
      } catch (error) {
        console.error('Error parsing stored brand data:', error);
        localStorage.removeItem('currentBrand');
      }
    }
  }, []);

  // Clear login forms when navigating to login pages
  useEffect(() => {
    if (location.pathname === '/login/influencer') {
      setInfluencerLoginForm({ email: '', password: '' });
      setLoginError('');
    }
    if (location.pathname === '/login/brand') {
      setBrandLoginForm({ email: '', password: '' });
      setBrandLoginError('');
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

  const handleBrandLoginChange = (field, value) => {
    setBrandLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();

  const handleInfluencerSignupSuccess = async () => {
    try {
      setInfluencerSignupError('');
      const response = await axios.post('http://localhost:8080/auth/signup/influencers', influencerForm);
      console.log(response.data);
      navigate('/login/influencer');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Error signing up influencer';
      console.error('Error signing up influencer:', error);
      setInfluencerSignupError(message + (error?.response?.data?.details ? `: ${error.response.data.details}` : ''));
    }
  };

  const handleBrandSignupSuccess = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/signup/brands', brandForm);
      console.log(response.data);
      navigate('/login/brand');
    } catch (error) {
      console.error('Error signing up brand:', error);
    }
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

  const handleBrandLoginSubmit = async () => {
    try {
      setIsBrandLoggingIn(true);
      setBrandLoginError('');
      const response = await axios.post('http://localhost:8080/auth/login/brands', brandLoginForm);
      console.log(response.data);
      // Store brand data in state
      if (response.data.brand) {
        setCurrentBrand(response.data.brand);
        // Also store in localStorage for persistence
        localStorage.setItem('currentBrand', JSON.stringify(response.data.brand));
      }
      // Clear login form after successful login
      setBrandLoginForm({ email: '', password: '' });
      navigate('/brand');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to log in. Please try again.';
      setBrandLoginError(message);
      console.error('Error logging in brand:', error);
    } finally {
      setIsBrandLoggingIn(false);
    }
  };

  const handleInfluencerLogout = () => {
    setCurrentInfluencer(null);
    localStorage.removeItem('currentInfluencer');
    navigate('/');
  };

  const handleBrandLogout = () => {
    setCurrentBrand(null);
    localStorage.removeItem('currentBrand');
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
            onGotoBrandLogin={() => navigate('/login/brand')}
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
            error={influencerSignupError}
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
      <Route
        path="/login/brand"
        element={
          <BrandLogin
            form={brandLoginForm}
            onChange={handleBrandLoginChange}
            onBack={() => navigate('/')}
            onSubmit={handleBrandLoginSubmit}
            isSubmitting={isBrandLoggingIn}
            error={brandLoginError}
          />
        }
      />
      <Route path="/influencer" element={<InfluencerDashboard influencer={currentInfluencer} onLogout={handleInfluencerLogout} />} />
      <Route path="/influencer/:id" element={<InfluencerProfile />} />
      <Route path="/brand" element={<BrandDashboard brand={currentBrand} onLogout={handleBrandLogout} />} />
    </Routes>
  );
};

export default InfluencerPlatform;


