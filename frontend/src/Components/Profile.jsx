import React, { useState, useEffect } from 'react';
import { User, Edit3, Settings, Home, LogOut, Shield, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import authUtils from '../utils/authUtils';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, getUserRole, getUserAddress, getUserEmail, getUserDisplayName, updateUserData } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    accountNo: '',
    role: 'user',
    image: null,
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  // Load user profile from Firestore
  const loadUserProfile = async (userId, authMethod = 'firebase') => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileData = {
          name: userData.name || userData.displayName || 'Not provided',
          phone: userData.phone || userData.phoneNumber || 'Not provided',
          address: userData.address || 'Not provided',
          email: userData.email || 'Not provided',
          accountNo: userData.accountNo || userId,
          role: userData.role || 'user',
          image: userData.image || userData.photoURL || null,
        };
        
        setProfile(profileData);
        setEditProfile(profileData);
      } else {
        // If no Firestore document exists, create one with current user data
        const currentUser = authUtils.getCurrentUser();
        const initialProfile = {
          name: currentUser?.displayName || currentUser?.name || 'Not provided',
          phone: currentUser?.phoneNumber || 'Not provided',
          address: currentUser?.address || 'Not provided',
          email: currentUser?.email || 'Not provided',
          accountNo: userId,
          role: currentUser?.role || 'user',
          image: currentUser?.photoURL || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          loginMethod: authMethod,
        };
        
        // Create the document in Firestore
        await setDoc(userDocRef, initialProfile);
        
        setProfile(initialProfile);
        setEditProfile(initialProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Fallback to current user data if Firestore fails
      const currentUser = authUtils.getCurrentUser();
      const fallbackProfile = {
        name: currentUser?.displayName || currentUser?.name || 'Not provided',
        phone: currentUser?.phoneNumber || 'Not provided',
        address: currentUser?.address || 'Not provided',
        email: currentUser?.email || 'Not provided',
        accountNo: userId,
        role: currentUser?.role || 'user',
        image: currentUser?.photoURL || null,
      };
      
      setProfile(fallbackProfile);
      setEditProfile(fallbackProfile);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      if (isAuthenticated()) {
        const currentUser = authUtils.getCurrentUser();
        setUser(currentUser);
        
        // Determine user ID and auth method
        let userId;
        let authMethod = 'firebase';
        
        if (auth.currentUser) {
          userId = auth.currentUser.uid;
          authMethod = 'firebase';
        } else {
          // MetaMask user
          userId = currentUser.address;
          authMethod = 'metamask';
        }
        
        await loadUserProfile(userId, authMethod);
      } else {
        // Redirect to login if no user is authenticated
        navigate('/login');
      }
      setLoading(false);
    };

    checkAuthAndLoadProfile();
  }, [navigate, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine user ID
      let userId;
      if (auth.currentUser) {
        userId = auth.currentUser.uid;
      } else {
        // MetaMask user
        const currentUser = authUtils.getCurrentUser();
        userId = currentUser.address;
      }
      
      const userDocRef = doc(db, 'users', userId);
      
      // Prepare updated profile data
      const updatedProfile = {
        ...editProfile,
        updatedAt: new Date().toISOString(),
      };
      
      // Update Firestore document
      await updateDoc(userDocRef, updatedProfile);
      
      // Update Firebase Auth profile if using Firebase auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: editProfile.name,
          photoURL: editProfile.image,
        });
      }

      // Update local user data
      await updateUserData(updatedProfile);

      // Update local profile state
      setProfile(updatedProfile);
      setActiveTab('view');
      
      console.log('Profile updated successfully');
      // You can add a success toast/notification here
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // You can add an error toast/notification here
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setActiveTab('view');
  };

  const handleSignOut = async () => {
    try {
      await authUtils.logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'user':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const tabs = [
    { id: 'view', label: 'View Details', icon: User },
    { id: 'edit', label: 'Edit Details', icon: Edit3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleHomeRedirect = () => {
    navigate('/');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={handleHomeRedirect}>
            <Home size={24} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* View Details Tab */}
            {activeTab === 'view' && (
              <div className="space-y-6">
                
                {/* Profile Header */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
                  <div className="relative">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{profile.name}</h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeStyle(profile.role)}`}>
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900">{profile.address}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <p className="text-gray-900 font-mono text-sm">{profile.accountNo}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user?.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Details Tab */}
            {activeTab === 'edit' && (
              <div className="space-y-6">
                
                {/* Profile Header */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
                  <div className="relative">
                    {editProfile.image ? (
                      <img
                        src={editProfile.image}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      name="name"
                      value={editProfile.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full mb-2"
                    />
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeStyle(editProfile.role)}`}>
                      {editProfile.role.charAt(0).toUpperCase() + editProfile.role.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editProfile.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editProfile.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editProfile.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={editProfile.image || ''}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Security Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Shield size={20} className="mr-2" />
                    Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lock size={20} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                        Change
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Bell size={20} className="mr-2" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;