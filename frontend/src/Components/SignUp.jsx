import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';  
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'; 
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import img from '../Images/img.png';

const Signup = () => {
  const navigate = useNavigate();
  
  // State to manage checkbox values
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

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
          previousLoans: [],
          currentLoan: null,
          image: null,
        });

        console.log("User signed up and profile created:", user);
        alert("Sign up successful!");
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert('An error occurred during sign up. Please try again later.');
    }
  };

  const handleClose = () => {
    navigate('/'); // Redirect to login or any other page you wish
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f4fc]">
      <div className="flex flex-col md:flex-row w-11/12 max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg relative">
        {/* Cross Button (top-right corner) */}
        <button
  onClick={handleClose}
  className="absolute top-1 right-2 text-3xl text-gray-600 hover:text-gray-800 p-2"
>
  &times;
</button>
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-[#2b7914] text-white p-8 flex flex-col justify-center items-center">
          <h1 className="text-xl text-center font-bold mb-4">Bringing communities together</h1>
          <p className="text-m text-center mb-4">Unlock community-driven lending with trust and ease</p>
          <div className="mt-4 h-[250px] w-[250px] flex justify-center items-center">
            <img src={img} alt="Community" className="object-cover" />
          </div>
        </div>
        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-[#1e3a8a] text-2xl mb-4">Sign up now</h2>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input type="text" placeholder="First name" id="fname" className="w-full p-3 border border-gray-300 rounded-lg text-lg mb-2 md:mb-0" />
              <input type="text" placeholder="Last name" id="lname" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <div className="mb-4">
              <input type="email" placeholder="Email address" id="remail" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <div className="mb-4">
              <input type="tel" placeholder="Phone number" id="rphone" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <div className="mb-4">
              <input type="password" placeholder="Password" id="rpassword" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            {/* New Fields: Address and Account Number */}
            <div className="mb-4">
              <input type="text" placeholder="Address" id="raddress" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            <div className="mb-4">
              <input type="text" placeholder="Account Number" id="raccountNo" className="w-full p-3 border border-gray-300 rounded-lg text-lg" />
            </div>
            {/* Checkboxes for Terms & Privacy Policy */}
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
              Sign up
            </button>
            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account? <a href='/Login' className="text-[#1e3a8a]">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
