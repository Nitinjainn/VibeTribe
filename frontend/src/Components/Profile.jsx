import { useState } from "react";
import Navbar from "./Navbar";
import {
  User,
  Edit3,
  Settings,
  LogOut,
  Shield,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Check,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import React from "react"; // Added missing import for React
import { ethers } from "ethers";

const Profile = () => {
  const { user, loading, updateUserData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("view");
  const [saving, setSaving] = useState(false);
  const [editProfile, setEditProfile] = useState(user ? { ...user } : {});
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Update editProfile when user changes
  React.useEffect(() => {
    if (user) setEditProfile({ ...user });
  }, [user]);

  // Check wallet connection on mount
  React.useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWalletConnection();
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Fetch balance when account changes
  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const bal = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(bal));
      } else {
        setBalance(null);
      }
    };
    fetchBalance();
  }, [account]);

  // Connect wallet handler
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch {
      // User rejected or error
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserData(editProfile);
      setActiveTab("view");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile({ ...user });
    setActiveTab("view");
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border border-red-200";
      case "user":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "premium":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const tabs = [
    { id: "view", label: "Profile Overview", icon: User },
    { id: "edit", label: "Edit Profile", icon: Edit3 },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">You are not logged in</h2>
            <p className="mb-4 text-gray-600">
              Please log in to view your profile.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Profile Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1  gap-8">
          {/* Sidebar removed, replaced by integrated card in main content */}
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg"
                            : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
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
                {/* Integrated Profile & Wallet Card */}
                {activeTab === "view" && (
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 bg-white rounded-2xl shadow border border-slate-100 p-6">
                      {/* Avatar, Username, Role */}
                      <div className="flex flex-col items-center md:items-start md:w-1/2 gap-2">
                        <div className="relative mb-2">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-100"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-[#e0f2fe] flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-blue-100">
                              <User size={40} className="text-blue-600" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">
                          {user.displayName || user.name || user.email}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(
                            user.role
                          )}`}
                        >
                          {user.role
                            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                            : "User"}
                        </span>
                      </div>
                      {/* Wallet Info */}
                      <div className="flex-1 flex flex-col justify-center items-center md:items-end gap-3">
                        <div className="flex items-center gap-2">
                          <Globe className="text-blue-500" size={20} />
                          <span className="text-lg font-semibold text-slate-800">Wallet</span>
                        </div>
                        {user.address ? (
                          account ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-700 text-sm">
                                  {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                                <button
                                  className="p-1 rounded bg-slate-100 hover:bg-blue-100"
                                  title="Copy address"
                                  onClick={() => {
                                    navigator.clipboard.writeText(account);
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                </button>
                                <a
                                  href={`https://etherscan.io/address/${account}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-xs"
                                >
                                  Explorer
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-semibold">Balance:</span>
                                <span className="font-semibold text-slate-800 text-base">
                                  {balance !== null ? `${Number(balance).toFixed(4)} ETH` : '0.00 ETH'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center md:items-end gap-2">
                              <span className="text-slate-500 text-sm mb-2">Wallet not connected</span>
                              <button onClick={connectWallet} disabled={isConnecting} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isConnecting ? 'Connecting...' : 'Connect your wallet'}
                              </button>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-slate-500 text-sm mb-2">Wallet not connected</span>
                            <button onClick={connectWallet} disabled={isConnecting} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                              {isConnecting ? 'Connecting...' : 'Connect your wallet'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* View Profile Tab */}
                {activeTab === "view" && (
                  <div className="space-y-8">
                    {/* Professional Info */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <User size={20} className="mr-2 text-blue-600" />
                        Professional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 p-6 rounded-xl border border-blue-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <Mail size={20} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                              </label>
                              <p className="text-slate-900 font-medium">
                                {user.email}
                              </p>
                              <div className="flex items-center mt-2">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-600 mr-1"
                                />
                                <span className="text-xs text-green-600">
                                  Verified
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/50 to-green-100/50 p-6 rounded-xl border border-green-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <Phone size={20} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                              </label>
                              <p className="text-slate-900 font-medium">
                                {user.phone ||
                                  user.phoneNumber ||
                                  "Not provided"}
                              </p>
                              <span className="text-xs text-slate-500 mt-1">
                                Mobile
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50/50 to-purple-100/50 p-6 rounded-xl border border-purple-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                              <MapPin size={20} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Location
                              </label>
                              <p className="text-slate-900 font-medium">
                                {user.location || "Not provided"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {user.timezone || ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 p-6 rounded-xl border border-emerald-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-emerald-100 rounded-full">
                              <Globe size={20} className="text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website
                              </label>
                              <a
                                href={user.website || "#"}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                              >
                                {user.website || "Not provided"}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bio Section */}
                    <div className="bg-gradient-to-r from-slate-50/50 to-slate-100/50 p-6 rounded-xl border border-slate-200/50">
                      <h4 className="text-lg font-semibold text-slate-800 mb-3">
                        About
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        {user.bio || "No bio provided."}
                      </p>
                    </div>
                    {/* Skills */}
                    {user.skills && user.skills.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">
                          Skills & Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-green-100 text-slate-700 rounded-full text-sm font-medium border border-blue-200/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Account Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 p-4 rounded-lg border border-blue-200/50">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          User ID
                        </label>
                        <p className="text-slate-900 font-mono text-sm">
                          {user.accountNo || user.uid || user.address || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50/50 to-green-100/50 p-4 rounded-lg border border-green-200/50">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Member Since
                        </label>
                        <p className="text-slate-900 text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50/50 to-purple-100/50 p-4 rounded-lg border border-purple-200/50">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Login
                        </label>
                        <p className="text-slate-900 text-sm">
                          {user.lastLogin || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Edit Profile Tab */}
                {activeTab === "edit" && (
                  <div className="space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-slate-200/50">
                      <div className="relative">
                        {editProfile.image ? (
                          <img
                            src={editProfile.image}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-100"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-[#e0f2fe] flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-blue-100">
                            <User size={32} className="text-blue-600" />
                          </div>
                        )}
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Camera size={16} className="text-white" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          name="displayName"
                          value={editProfile.displayName || ""}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-blue-600 w-full mb-3 transition-colors"
                        />
                        <input
                          type="text"
                          name="position"
                          value={editProfile.position || ""}
                          onChange={handleInputChange}
                          placeholder="Your position"
                          className="text-slate-600 bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-600 w-full mb-3 transition-colors"
                        />
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeStyle(
                            editProfile.role
                          )}`}
                        >
                          {editProfile.role
                            ? editProfile.role.charAt(0).toUpperCase() +
                              editProfile.role.slice(1)
                            : "User"}
                        </span>
                      </div>
                    </div>
                    {/* Edit Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editProfile.email || ""}
                          onChange={handleInputChange}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={
                            editProfile.phone || editProfile.phoneNumber || ""
                          }
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={editProfile.position || ""}
                          onChange={handleInputChange}
                          placeholder="Your position"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={editProfile.website || ""}
                          onChange={handleInputChange}
                          placeholder="Your website"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={editProfile.location || ""}
                          onChange={handleInputChange}
                          placeholder="Your location"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={editProfile.bio || ""}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200/50">
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold text-white bg-[#38bdf8] border border-transparent rounded-lg hover:bg-[#0ea5e9] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={16} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-8">
                    {/* Security Settings */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Shield size={20} className="mr-2 text-blue-600" />
                        Security & Privacy
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 p-6 rounded-xl border border-blue-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <Lock size={20} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 mb-2">
                                Change Password
                              </h4>
                              <p className="text-sm text-slate-600 mb-4">
                                Update your account password for better security
                              </p>
                              <button className="px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all">
                                Change Password
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/50 to-green-100/50 p-6 rounded-xl border border-green-200/50">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <Shield size={20} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 mb-2">
                                Two-Factor Authentication
                              </h4>
                              <p className="text-sm text-slate-600 mb-4">
                                Add an extra layer of security to your account
                              </p>
                              <button className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-all">
                                Enable 2FA
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Notification Settings */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Bell size={20} className="mr-2 text-blue-600" />
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">
                            Email Notifications
                          </span>
                          <button
                            onClick={() => handleNotificationToggle("email")}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                              notifications.email
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                notifications.email ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">
                            SMS Notifications
                          </span>
                          <button
                            onClick={() => handleNotificationToggle("sms")}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                              notifications.sms ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                notifications.sms ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">
                            Push Notifications
                          </span>
                          <button
                            onClick={() => handleNotificationToggle("push")}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                              notifications.push
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                notifications.push ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">
                            Marketing Updates
                          </span>
                          <button
                            onClick={() =>
                              handleNotificationToggle("marketing")
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                              notifications.marketing
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                notifications.marketing ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Sign Out Button */}
                    <div className="pt-8 flex justify-end">
                      <button
                        onClick={handleSignOut}
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 border border-transparent rounded-lg hover:from-red-700 hover:to-pink-700 transition-all flex items-center shadow-lg"
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
      </div>
    </div>
  );
};

export default Profile;
