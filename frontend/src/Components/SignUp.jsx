import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';  
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'; 
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import img from '../Images/img.png';
import metamaskAuth from '../utils/metamaskAuth';
import { debugAuth } from '../utils/debugAuth';
import MetaMaskGuide from './MetaMaskGuide';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);
  const [showMetaMaskForm, setShowMetaMaskForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [signupMethod, setSignupMethod] = useState('email'); // 'email' or 'metamask'
  const [walletAddress, setWalletAddress] = useState('');

  // Prefill MetaMask wallet address if passed via navigation state
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
    const email = document.getElementById("remail").value;
    const password = document.getElementById("rpassword").value;
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const phone = document.getElementById("rphone").value;
    const address = document.getElementById("raddress").value;  
    const accountNo = document.getElementById("raccountNo").value;  

    if (!isTermsChecked || !isPrivacyChecked) {
      alert("Please agree to the Terms & Conditions and Privacy Policy to proceed.");
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert('Email address is already in use. Please use a different email address.');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: `${fname} ${lname}`,
          email,
          phone,
          address,       
          accountNo,     
          role: "user",
          previousLoans: [],
          currentLoan: null,
          image: null,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('userData', JSON.stringify({
          name: `${fname} ${lname}`,
          email,
          phone,
          address,
          accountNo,
          role: "user",
        }));
        alert("Sign up successful!");
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert('An error occurred during sign up. Please try again later.');
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
        setTimeout(() => {
          const addressField = document.getElementById("mwalletAddress");
          if (addressField) {
            addressField.value = result.address;
            addressField.disabled = true;
          }
        }, 100);
      } else {
        alert(`MetaMask connection failed: ${result.error}`);
      }
    } catch (error) {
      alert(error.message || "MetaMask connection failed. Please try again.");
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
      const phone = document.getElementById("mphone").value;
      const email = document.getElementById("memail").value;
      const physicalAddress = document.getElementById("mphysicalAddress").value;
      const accountNo = document.getElementById("maccountNo").value;
      const walletAddr = document.getElementById("mwalletAddress").value;
      if (!fname || !lname || !email) {
        alert("First name, last name, and email are required.");
        setMetamaskLoading(false);
        return;
      }
      // Authenticate (sign message) before creating user
      const authResult = await metamaskAuth.authenticate();
      if (!authResult.success) {
        if (authResult.error.includes('rejected the signature request')) {
          const retry = confirm(
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
        phone: phone || 'Not provided',
        physicalAddress: physicalAddress || 'Not provided',
        accountNo: accountNo || walletAddr,
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
    } catch (error) {
      console.error("MetaMask signup error:", error);
      alert(`MetaMask signup error: ${error.message}`);
    } finally {
      setMetamaskLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#f0f4fc]">
        <div className="flex flex-col md:flex-row w-11/12 max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg relative">
          <button
            onClick={handleClose}
            className="absolute top-1 right-2 text-3xl text-gray-600 hover:text-gray-800 p-2"
          >
            &times;
          </button>
          <div className="w-full md:w-1/2 bg-[#2b7914] text-white p-8 flex flex-col justify-center items-center">
            <h1 className="text-xl text-center font-bold mb-4">Bringing communities together</h1>
            <p className="text-m text-center mb-4">Unlock community-driven lending with trust and ease</p>
            <div className="mt-4 h-[250px] w-[250px] flex justify-center items-center">
              <img src={img} alt="Community" className="object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-[#1e3a8a] text-2xl mb-4">Sign up now</h2>
            <div className="mb-6 flex space-x-4">
              <button
                onClick={() => { setSignupMethod('email'); setShowMetaMaskForm(false); }}
                className={`flex-1 p-3 rounded-lg text-lg transition-all duration-300 ${signupMethod === 'email' ? 'bg-[#46a720] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Email Signup
              </button>
              <button
                onClick={() => { setSignupMethod('metamask'); setShowMetaMaskForm(false); }}
                className={`flex-1 p-3 rounded-lg text-lg transition-all duration-300 flex items-center justify-center gap-2 ${signupMethod === 'metamask' ? 'bg-[#f6851b] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                </svg>
                MetaMask
              </button>
            </div>
            {/* Email/Password Signup Form */}
            {signupMethod === 'email' && !showMetaMaskForm && (
              <form onSubmit={handleSignup}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <input type="text" placeholder="First name" id="fname" className="w-full p-3 border border-gray-300 rounded-lg text-lg mb-2 md:mb-0" required />
                  <input type="text" placeholder="Last name" id="lname" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                </div>
                <div className="mb-4">
                  <input type="email" placeholder="Email address" id="remail" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                </div>
                <div className="mb-4">
                  <input type="tel" placeholder="Phone number" id="rphone" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="mb-4">
                  <input type="password" placeholder="Password" id="rpassword" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                </div>
                <div className="mb-4">
                  <input type="text" placeholder="Address" id="raddress" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="mb-4">
                  <input type="text" placeholder="Account Number" id="raccountNo" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={isTermsChecked} 
                    onChange={(e) => setIsTermsChecked(e.target.checked)} 
                    className="w-5 h-5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-[#1e3a8a]">Terms & Conditions</a>
                  </label>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    checked={isPrivacyChecked} 
                    onChange={(e) => setIsPrivacyChecked(e.target.checked)} 
                    className="w-5 h-5"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700">
                    I agree to the <a href="/privacy" className="text-[#1e3a8a]">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" className="w-full p-3 bg-[#46a720] text-black rounded-lg text-lg hover:bg-[#184d14] transition-all duration-300 hover:text-gray-100">
                  Sign up with Email
                </button>
              </form>
            )}
            {/* MetaMask Connect Step */}
            {signupMethod === 'metamask' && !showMetaMaskForm && (
              <div className="flex flex-col items-center">
                <button
                  onClick={handleMetaMaskConnect}
                  disabled={metamaskLoading}
                  className="w-full p-3 bg-[#f6851b] text-white rounded-lg text-lg hover:bg-[#e2761b] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {metamaskLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
              <form onSubmit={handleMetaMaskFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                  <input 
                    type="text" 
                    id="mwalletAddress" 
                    className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-gray-100" 
                    readOnly 
                    value={walletAddress}
                    placeholder="Wallet address will appear here"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <input type="text" placeholder="First name" id="mfname" className="w-full p-3 border border-gray-300 rounded-lg text-lg mb-2 md:mb-0" required />
                  <input type="text" placeholder="Last name" id="mlname" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                </div>
                <div className="mb-4">
                  <input type="email" placeholder="Email address" id="memail" className="w-full p-3 border border-gray-300 rounded-lg text-lg" required />
                </div>
                <div className="mb-4">
                  <input type="tel" placeholder="Phone number" id="mphone" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="mb-4">
                  <input type="text" placeholder="Physical Address" id="mphysicalAddress" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="mb-4">
                  <input type="text" placeholder="Account Number" id="maccountNo" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="mterms" 
                    checked={isTermsChecked} 
                    onChange={(e) => setIsTermsChecked(e.target.checked)} 
                    className="w-5 h-5"
                  />
                  <label htmlFor="mterms" className="text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-[#1e3a8a]">Terms & Conditions</a>
                  </label>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="mprivacy" 
                    checked={isPrivacyChecked} 
                    onChange={(e) => setIsPrivacyChecked(e.target.checked)} 
                    className="w-5 h-5"
                  />
                  <label htmlFor="mprivacy" className="text-sm text-gray-700">
                    I agree to the <a href="/privacy" className="text-[#1e3a8a]">Privacy Policy</a>
                  </label>
                </div>
                <div className="flex space-x-4 mb-4">
                  <button 
                    type="button"
                    onClick={() => { setShowMetaMaskForm(false); }}
                    className="flex-1 p-3 bg-gray-500 text-white rounded-lg text-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Back to Connect
                  </button>
                  <button 
                    type="submit"
                    disabled={metamaskLoading}
                    className="flex-1 p-3 bg-[#f6851b] text-white rounded-lg text-lg hover:bg-[#e2761b] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {metamaskLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
              Already have an account? <a href='/Login' className="text-[#1e3a8a]">Login</a>
            </p>
          </div>
        </div>
      </div>
      <MetaMaskGuide 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onContinue={handleMetaMaskConnect}
      />
    </>
  );
};

export default Signup;