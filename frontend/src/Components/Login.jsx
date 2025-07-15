import { auth, db } from '../firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import metamaskAuth from '../utils/metamaskAuth';
import { debugAuth } from '../utils/debugAuth';
import { Wallet, Shield, User, CheckCircle, X, AlertCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({ general: '' });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ general: '' });
    const { email, password } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('userData', JSON.stringify(userData));
        const userRole = (userData.role || 'user').toLowerCase();
        alert('Login successful!');
        navigate('/');
      } else {
        setErrors({ general: 'Error retrieving user data' });
      }
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setMetamaskLoading(true);
    try {
      const result = await metamaskAuth.authenticate();
      if (result.success) {
        debugAuth();
        const userRole = (result.userData.role || 'user').toLowerCase();
        alert('MetaMask login successful!');
        navigate('/');
      } else {
        if (result.error.includes('rejected the signature request')) {
          const retry = window.confirm(
            "You rejected the signature request. This is required to verify your wallet ownership.\n\n" +
            "Please try again and click 'Sign' in MetaMask when prompted.\n\n" +
            "Would you like to try again?"
          );
          if (retry) {
            setMetamaskLoading(false);
            return;
          } else {
            alert("Signature request was rejected. Please try again later.");
          }
        } else {
          alert(`MetaMask login failed: ${result.error}`);
        }
      }
    } catch (error) {
      alert(`MetaMask login error: ${error.message}`);
    } finally {
      setMetamaskLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
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
                    Welcome Back!
                  </h2>
                  <p className="text-lg text-green-100 mb-8 leading-relaxed">
                    Access your decentralized travel community and continue your journey with fellow adventurers.
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
            {/* Right Section - Login Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                  <p className="text-gray-600">Choose your preferred authentication method</p>
                </div>
                {/* Error Message */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{errors.general}</span>
                  </div>
                )}
                {/* MetaMask Login */}
                <div className="mb-6">
                  <button
                    onClick={handleMetaMaskLogin}
                    disabled={metamaskLoading || isLoading}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 font-medium transition-all duration-300 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {metamaskLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Connecting to MetaMask...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                          </svg>
                          <span>Connect with MetaMask</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
                  </div>
                </div>
                {/* Email/Password Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your email address"
                        className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v2m0 4h.01M17 16v-2a5 5 0 00-10 0v2a2 2 0 002 2h6a2 2 0 002-2z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your password"
                        className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white rounded-xl p-4 font-medium transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;