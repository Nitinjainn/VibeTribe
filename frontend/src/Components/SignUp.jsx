import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';  
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'; 
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import metamaskAuth from '../utils/metamaskAuth';
import { debugAuth } from '../utils/debugAuth';
import MetaMaskGuide from './MetaMaskGuide';
import { Wallet, Shield, User, CheckCircle, X, Loader2, Mail } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);
  const [showMetaMaskForm, setShowMetaMaskForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [signupMethod, setSignupMethod] = useState('email');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fname: '', lname: '', email: '', password: '' });
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({ general: '' });

  useEffect(() => {
    if (location.state && location.state.walletAddress) {
      setSignupMethod('metamask');
      setShowMetaMaskForm(true);
      setWalletAddress(location.state.walletAddress);
    }
  }, [location.state]);

  // Email sign up
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ general: '' });
    const { fname, lname, email, password } = formData;
    if (!isTermsChecked || !isPrivacyChecked) {
      setErrors({ general: 'Please agree to the Terms & Conditions and Privacy Policy to proceed.' });
      setIsLoading(false);
      return;
    }
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrors({ general: 'Email address is already in use. Please use a different email address.' });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: `${fname} ${lname}`,
          email,
          role: "user",
          previousLoans: [],
          currentLoan: null,
          image: null,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('userData', JSON.stringify({
          name: `${fname} ${lname}`,
          email,
          role: "user",
        }));
        alert("Sign up successful!");
        navigate('/profile');
      }
    } catch {
      setErrors({ general: 'An error occurred during sign up. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  // MetaMask connect and show form
  const handleMetaMaskConnect = async () => {
    setMetamaskLoading(true);
    setShowGuide(true);
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) =>
      timeoutId = setTimeout(() => reject(new Error('MetaMask connection timed out. Please try again.')), 20000)
    );
    try {
      setShowGuide(false);
      const result = await Promise.race([
        metamaskAuth.connectWallet(),
        timeoutPromise
      ]);
      clearTimeout(timeoutId);
      if (result.success) {
        setWalletAddress(result.address);
        setShowMetaMaskForm(true);
      } else {
        setErrors({ general: `MetaMask connection failed: ${result.error}` });
      }
    } catch (e) {
      setErrors({ general: e.message || "MetaMask connection failed. Please try again." });
    } finally {
      setMetamaskLoading(false);
    }
  };

  // MetaMask form submit (create user)
  const handleMetaMaskFormSubmit = async (e) => {
    e.preventDefault();
    setMetamaskLoading(true);
    try {
      const fname = document.getElementById("mfname").value;
      const lname = document.getElementById("mlname").value;
      const email = document.getElementById("memail").value;
      const walletAddr = document.getElementById("mwalletAddress").value;
      if (!fname || !lname || !email) {
        setErrors({ general: "First name, last name, and email are required." });
        setMetamaskLoading(false);
        return;
      }
      // Authenticate (sign message) before creating user
      const authResult = await metamaskAuth.authenticate();
      if (!authResult.success) {
        if (authResult.error.includes('rejected the signature request')) {
          const retry = window.confirm(
            "You rejected the signature request. This is required to verify your wallet ownership.\n\n" +
            "Please try again and click 'Sign' in MetaMask when prompted.\n\n" +
            "Would you like to try again?"
          );
          if (retry) {
            setMetamaskLoading(false);
            return;
          } else {
            throw new Error("Signature request was rejected. Please try again later.");
          }
        }
        throw new Error(authResult.error);
      }
      const enhancedUserData = {
        name: `${fname} ${lname}`,
        firstName: fname,
        lastName: lname,
        email: email,
        displayName: `${fname} ${lname}`,
        previousLoans: [],
        currentLoan: null,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loginMethod: 'metamask',
        profileComplete: true,
        address: walletAddr,
        role: 'user',
      };
      const userDocRef = doc(db, 'users', walletAddr);
      await setDoc(userDocRef, enhancedUserData);
      localStorage.setItem('userData', JSON.stringify(enhancedUserData));
      debugAuth();
      alert("MetaMask sign up successful!");
      navigate('/profile');
    } catch (e) {
      setErrors({ general: `MetaMask signup error: ${e.message}` });
    } finally {
      setMetamaskLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-100/50 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left Section - Brand & Info */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10 text-white">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">VibeTribe</h1>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Join the Adventure!
                  </h2>
                  <p className="text-lg text-green-100 mb-8 leading-relaxed">
                    Create your account and unlock a world of decentralized travel and community experiences.
                  </p>
                </div>
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-100">Secure blockchain authentication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-100">Connect with global travelers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-100">Transparent fund management</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Section - Signup Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h3>
                  <p className="text-gray-600">Choose your preferred signup method</p>
                </div>
                {/* Error Message */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <span className="text-red-700 text-sm">{errors.general}</span>
                  </div>
                )}
                {/* MetaMask Signup */}
                <div className="mb-6 flex gap-4">
                  <button
                    onClick={() => { setSignupMethod('email'); setShowMetaMaskForm(false); }}
                    className={`flex-1 p-3 rounded-lg text-lg font-medium transition-all duration-300 ${signupMethod === 'email' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Email Signup
                  </button>
                  <button
                    onClick={() => { setSignupMethod('metamask'); setShowMetaMaskForm(false); }}
                    className={`flex-1 p-3 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${signupMethod === 'metamask' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                    </svg>
                    MetaMask
                  </button>
                </div>
                {/* Email/Password Signup Form */}
                {signupMethod === 'email' && !showMetaMaskForm && (
                  <form className="space-y-6" onSubmit={handleSignup}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleInputChange} onFocus={() => setFocusedField('fname')} onBlur={() => setFocusedField('')} className={`block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`} required />
                      </div>
                      <div className="space-y-2 w-full">
                        <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleInputChange} onFocus={() => setFocusedField('lname')} onBlur={() => setFocusedField('')} className={`block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-green-500' : 'text-gray-400'}`} />
                        </div>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="Enter your email address" className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`} required autoComplete="email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01M17 16v-2a5 5 0 00-10 0v2a2 2 0 002 2h6a2 2 0 002-2z" />
                          </svg>
                        </div>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} placeholder="Enter your password" className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`} required autoComplete="current-password" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" id="terms" checked={isTermsChecked} onChange={(e) => setIsTermsChecked(e.target.checked)} className="w-5 h-5" />
                      <label htmlFor="terms" className="text-sm text-gray-700">I agree to the <a href="/terms" className="text-green-700 underline">Terms & Conditions</a></label>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <input type="checkbox" id="privacy" checked={isPrivacyChecked} onChange={(e) => setIsPrivacyChecked(e.target.checked)} className="w-5 h-5" />
                      <label htmlFor="privacy" className="text-sm text-gray-700">I agree to the <a href="/privacy" className="text-green-700 underline">Privacy Policy</a></label>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white rounded-xl p-4 font-medium transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Signing up...
                        </span>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </form>
                )}
                {/* MetaMask Connect Step */}
                {signupMethod === 'metamask' && !showMetaMaskForm && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleMetaMaskConnect}
                      disabled={metamaskLoading}
                      className="w-full p-3 bg-orange-500 text-white rounded-lg text-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                      {metamaskLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                          </svg>
                          Connect with MetaMask
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-600 mt-2 text-center">Connect your wallet to start MetaMask sign up.</p>
                  </div>
                )}
                {/* MetaMask Details Form Step */}
                {signupMethod === 'metamask' && showMetaMaskForm && (
                  <form onSubmit={handleMetaMaskFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                      <input type="text" id="mwalletAddress" className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-gray-100" readOnly value={walletAddress} placeholder="Wallet address will appear here" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <label htmlFor="mfname" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="mfname" className="w-full p-3 border border-gray-300 rounded-lg text-lg mb-2 md:mb-0" required />
                      </div>
                      <div className="space-y-2 w-full">
                        <label htmlFor="mlname" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="mlname" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="memail" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" id="memail" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" id="mterms" checked={isTermsChecked} onChange={(e) => setIsTermsChecked(e.target.checked)} className="w-5 h-5" />
                      <label htmlFor="mterms" className="text-sm text-gray-700">I agree to the <a href="/terms" className="text-green-700 underline">Terms & Conditions</a></label>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <input type="checkbox" id="mprivacy" checked={isPrivacyChecked} onChange={(e) => setIsPrivacyChecked(e.target.checked)} className="w-5 h-5" />
                      <label htmlFor="mprivacy" className="text-sm text-gray-700">I agree to the <a href="/privacy" className="text-green-700 underline">Privacy Policy</a></label>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <button type="button" onClick={() => { setShowMetaMaskForm(false); }} className="flex-1 p-3 bg-gray-500 text-white rounded-lg text-lg hover:bg-gray-600 transition-all duration-300">Back to Connect</button>
                      <button type="submit" disabled={metamaskLoading} className="flex-1 p-3 bg-orange-500 text-white rounded-lg text-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {metamaskLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                            </svg>
                            Create MetaMask Account
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
                <p className="text-sm text-center text-gray-600 mt-6">
                  Already have an account? <a href='/Login' className="text-green-700 underline">Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MetaMaskGuide 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onContinue={handleMetaMaskConnect}
      />
    </div>
  );
};

export default Signup;