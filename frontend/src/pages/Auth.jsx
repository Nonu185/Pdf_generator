import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`https://flakes-pdf-d4h7.onrender.com${endpoint}`, formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Trigger a custom event to update Navbar immediately
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] mt-10">
      <div className="w-full bg-white p-8 rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-50">
        <h2 className="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="mb-4 text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleChange} 
              required={!isLogin}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          )}

          <input 
            type="text" 
            name="email" 
            placeholder={isLogin ? "Email or Username" : "Email"} 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
          />

          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full rounded-2xl px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium text-xl hover:shadow-lg hover:shadow-pink-200/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={toggleAuthMode} 
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-80 transition-opacity"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Auth;
