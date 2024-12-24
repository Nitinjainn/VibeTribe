import React, { useState } from 'react';

const Body = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Our team will reach out to you soon.");
    setIsModalOpen(false); // Close the modal after submitting
  };

  return (
    <div className={`relative w-full h-screen flex justify-center items-center px-4 py-6 ${isModalOpen ? 'overflow-hidden' : ''}`}>
    <div
      className={`relative w-full h-full max-w-full mx-auto bg-cover bg-center bg-no-repeat shadow-2xl rounded-xl overflow-hidden border border-gray-300 transition-all duration-500 ${isModalOpen ? 'blur-sm' : ''}`}
      style={{
        backgroundImage: "url('https://miro.medium.com/v2/resize:fit:1200/1*ggfwCv5wd2xih-2MtP9qcw.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl"></div>

        {/* "Need Money Urgently" Button at the top right */}
        {/* <div className="absolute top-4 right-4 z-20">
          <a
            onClick={openModal}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-3 text-sm font-bold text-white shadow-md transition-transform duration-200 transform hover:scale-105 hover:from-red-600 hover:via-red-700 hover:to-red-800 cursor-pointer"
          >
            <i className="fas fa-exclamation-circle text-white"></i> Need Money Urgently?
          </a>
        </div> */}

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-md mb-4">
            Travel Boldly, <span className="bg-gradient-to-r from-green-400 via-teal-500 to-yellow-400 text-transparent bg-clip-text">Transact Globally</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-gray-100 leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
          Connect with Travelers Like You! Effortless Payments, Unique Experiences, and Instant Connections—Join, Pay, and Travel with New Friends Anywhere in the world!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/CommunityCards"
              className="rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-black shadow-lg hover:bg-green-700 hover:shadow-xl transition-all cursor-pointer hover:text-slate-100"
            >
              Search Community
            </a>
            <a
              href="/CreateCommunity"
              className="rounded-full border border-gray-100 px-8 py-4 text-lg font-semibold text-gray-100 hover:bg-gray-100 hover:text-black transition-all cursor-pointer"
            >
              Create Community
            </a>
          </div>
        </div>
      </div>

      {/* Modal Form with Smooth Transition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-in-out">
          <div className={`bg-white rounded-lg p-8 shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Urgent Funding Request</h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
                required
              />

              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />

              <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
              <input
                type="tel"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your contact number"
                required
              />

              <label className="block text-gray-700 font-semibold mb-2">Amount Needed</label>
              <input
                type="number"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter amount"
                required
              />

              {/* Reason for Urgent Money - Dropdown */}
              <label className="block text-gray-700 font-semibold mb-2">Reason for Urgent Money</label>
              <select
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="medical">Medical Emergency</option>
                <option value="education">Education</option>
                <option value="hospitality">Hospitality</option>
                <option value="debt">Debt Repayment</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
