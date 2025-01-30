import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return regex.test(email);
  };

  const handleJoinNow = () => {
    if (validateEmail(waitlistEmail)) {
      setIsValidEmail(true);
      setIsSubmitted(true);
      // Here you can also add logic to send the email to your backend if needed
    } else {
      setIsValidEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-6 text-white">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">AI-Powered App Generation</h1>
        <p className="mt-4 text-lg text-gray-300">
          Build fully customizable apps with seamless DouSign integration in minutes. No coding required.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-gray-900">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="mt-2 text-gray-600">Continue to OneShotCodeGen</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="Enter your password"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Call to Action */}
      {!isSubmitted ? (
        <div className="mt-12 text-center max-w-2xl">
          <h3 className="text-2xl font-bold">We're in Beta! Join our waitlist.</h3>
          <div className="mt-4">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              className={`w-full px-4 py-3 text-black border ${isValidEmail ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your email to join the waitlist"
            />
            <button
              onClick={handleJoinNow}
              className="mt-2 w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Join Now
            </button>
            {!isValidEmail && <p className="text-red-500 mt-2">Please enter a valid email address.</p>}
          </div>
        </div>
      ) : (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold">Thank you for joining the waitlist!</h3>
          <p className="mt-4 text-green-600 font-semibold">We'll keep you updated.</p>
        </div>
      )}
    </div>
  );
};

export default Login;
