import React, { useEffect, useState } from 'react';
import { User, CreditCard, BarChart, Key } from 'lucide-react';
import Header from '../components/Header';
import { api } from '../services/api';

interface UserProfile {
  name: string;
  email: string;
}

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('account');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const categories = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'usage', name: 'Usage', icon: BarChart },
    { id: 'apis', name: 'APIs', icon: Key },
  ];

  // Mock data for DocuSign API settings
  const docusignSettings = {
    clientId: "3f7b****************************8d2c",
    integrationKey: "89a1****************************4f5d",
    accountId: "12e3****************************7b9c",
    userId: "45d6****************************2h8k",
    environment: "demo"
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/settings/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setLoading(true);
      await api.put('/settings/profile', profile);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" />
      
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="grid grid-cols-4 min-h-[600px]">
            {/* Settings Navigation */}
            <div className="col-span-1 border-r">
              <nav className="p-4">
                {categories.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left mb-2 ${
                      activeCategory === id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeCategory === id ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span>{name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="col-span-3 p-6">
              {activeCategory === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'subscription' && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription</h2>
                  <p className="text-gray-600 mb-6">Coming Soon</p>
                  <p className="text-sm text-gray-500">We're working on bringing you subscription options.</p>
                </div>
              )}

              {activeCategory === 'usage' && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Statistics</h2>
                  <p className="text-gray-600 mb-6">Coming Soon</p>
                  <p className="text-sm text-gray-500">Track your usage statistics here.</p>
                </div>
              )}

              {activeCategory === 'apis' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">API Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">DocuSign Integration</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client ID
                          </label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={docusignSettings.clientId}
                              disabled
                              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                            />
                            <button className="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                              Show
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Integration Key
                          </label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={docusignSettings.integrationKey}
                              disabled
                              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                            />
                            <button className="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                              Show
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account ID
                          </label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={docusignSettings.accountId}
                              disabled
                              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                            />
                            <button className="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                              Show
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                          </label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={docusignSettings.userId}
                              disabled
                              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                            />
                            <button className="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                              Show
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Environment
                          </label>
                          <select
                            value={docusignSettings.environment}
                            disabled
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                          >
                            <option value="demo">Demo</option>
                            <option value="production">Production</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                          disabled
                        >
                          Update DocuSign Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;