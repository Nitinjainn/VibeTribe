import React from 'react';
import { auth, db } from '../firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import img from '../Images/loginimg.png';

const Login = () => {
  const navigate = useNavigate();

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

        // Store the user data in localStorage (or state management like context if you want to persist across pages)
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show the success alert and navigate to profile
        alert('Login successful!');
        navigate('/profile'); // Redirect to the profile page
      } else {
        console.log("No user data found in Firestore");
        alert('Error retrieving user data');
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert('Invalid email or password');
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
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-[#1e3a8a] text-2xl mb-4">Log In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input type="email" placeholder="Email address" id="email" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <div className="mb-4">
              <input type="password" placeholder="Password" id="password" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <button type="submit" className="w-full p-3 bg-[#1c9125] text-white rounded-lg text-lg hover:bg-[#22741f] transition-all duration-300">
              Log in
            </button>
            <p className="text-sm text-center text-gray-600 mt-6">
              Don't have an account? <a href="/Signup" className="text-[#1e3a8a]">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
