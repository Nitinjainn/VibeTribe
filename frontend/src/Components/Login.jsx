import { auth, db } from '../firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import metamaskAuth from '../utils/metamaskAuth';
import { debugAuth } from '../utils/debugAuth';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");

      // Get the user data from Firestore
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);

        // Store the user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Check user role and redirect accordingly
       const userRole = (userData.role || 'user').toLowerCase();

if (userRole === 'admin') {
  alert('Admin login successful!');
  navigate('/admin');
} else {
  alert('Login successful!');
  navigate('/');
} // Default to 'user' if no role is set
      } else {
        console.log("No user data found in Firestore");
        alert('Error retrieving user data');
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert('Invalid email or password');
    }
  };

  const handleMetaMaskLogin = async () => {
    setMetamaskLoading(true);
    try {
      console.log("Starting MetaMask authentication...");
      
      const result = await metamaskAuth.authenticate();
      
      if (result.success) {
        console.log("MetaMask login successful:", result.userData);
        
        // Debug authentication state
        debugAuth();
        
        // Check user role and redirect accordingly
        const userRole = (result.userData.role || 'user').toLowerCase();
        
        if (userRole === 'admin') {
          alert('Admin login successful with MetaMask!');
          navigate('/admin');
        } else {
          alert('MetaMask login successful!');
          navigate('/');
        }
      } else {
        // Check if it's a signature rejection
        if (result.error.includes('rejected the signature request')) {
          const retry = confirm(
            "You rejected the signature request. This is required to verify your wallet ownership.\n\n" +
            "Please try again and click 'Sign' in MetaMask when prompted.\n\n" +
            "Would you like to try again?"
          );
          
          if (retry) {
            setMetamaskLoading(false);
            return; // Let user try again
          } else {
            alert("Signature request was rejected. Please try again later.");
          }
        } else {
          alert(`MetaMask login failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      alert(`MetaMask login error: ${error.message}`);
    } finally {
      setMetamaskLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/'); // Redirect to home when close button is clicked
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f4fc] relative">
      <div className="flex flex-col md:flex-row w-11/12 max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg relative">
        {/* Close Button Inside the Box */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-2 text-3xl text-gray-600 hover:text-gray-800 p-2"
        >
          &times;
        </button>

        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-[#136613] text-white p-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl text-center font-bold mb-4">Welcome Back!</h1>
          <p className="text-center text-sm opacity-90">Choose your preferred login method</p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-[#1e3a8a] text-2xl mb-4">Log In</h2>
          
          {/* MetaMask Login Button */}
          <div className="mb-6">
            <button
              onClick={handleMetaMaskLogin}
              disabled={metamaskLoading}
              className="w-full p-3 bg-[#f6851b] text-white rounded-lg text-lg hover:bg-[#e2761b] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {metamaskLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.49 4.27c-.32-.73-.84-1.35-1.49-1.8L12.5.5c-.73-.32-1.54-.32-2.27 0L3.5 2.47c-.65.45-1.17 1.07-1.49 1.8L.5 6.5c-.32.73-.32 1.54 0 2.27l1.51 2.23c.32.73.84 1.35 1.49 1.8l6.73 3.97c.73.32 1.54.32 2.27 0l6.73-3.97c.65-.45 1.17-1.07 1.49-1.8L23.5 6.5c.32-.73.32-1.54 0-2.27l-1.51-2.23z"/>
                  </svg>
                  Connect with MetaMask
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Email address" 
                id="email" 
                className="w-full p-3 border border-gray-300 rounded-lg text-lg" 
              />
            </div>
            <div className="mb-4">
              <input 
                type="password" 
                placeholder="Password" 
                id="password" 
                className="w-full p-3 border border-gray-300 rounded-lg text-lg" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full p-3 bg-[#1c9125] text-white rounded-lg text-lg hover:bg-[#22741f] transition-all duration-300"
            >
              Log in with Email
            </button>
            <p className="text-sm text-center text-gray-600 mt-6">
              Dont have an account? <a href="/Signup" className="text-[#1e3a8a]">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;