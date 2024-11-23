import React, { useState } from 'react';
import Navbar from './Navbar';

const HowItWorks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
    <Navbar/>
    <div className="relative w-full min-h-screen flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
          How VibeTribe Works
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8">
          Inspired by community-driven travel experiences, VibeTribe brings the concept of shared travel goals and
          support to life. Our aim is to make travel accessible, enjoyable, and impactful for everyone.
        </p>
        <button
          onClick={openModal}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold text-white bg-green-600 rounded-full shadow hover:bg-green-800 transition-transform transform hover:scale-105"
        >
          Learn More
        </button>
      </div>

      {/* Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-md">
          <div className="bg-white max-w-lg w-full mx-4 sm:mx-8 lg:mx-12 p-6 sm:p-8 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">How VibeTribe Empowers Travelers</h2>
            <p className="text-sm sm:text-base text-gray-700">
              VibeTribe uses a shared travel fund model to help members achieve their travel goals. Here’s how:
            </p>
            <ul className="text-left list-disc list-inside space-y-2 text-gray-600 mt-4 text-sm sm:text-base">
              <li>
                <strong>Shared Travel Fund:</strong> Members contribute monthly, with funds being used to support a rotating
                member’s travel needs, earning interest along the way.
              </li>
              <li>
                <strong>Travel Loans:</strong> We offer loans to members who need assistance, making travel more affordable
                for everyone.
              </li>
              <li>
                <strong>Collaborative Travel:</strong> VibeTribe connects like-minded travelers, creating a platform for
                shared experiences and goals.
              </li>
              <li>
                <strong>Low-Cost Funding:</strong> We provide loans and support to underserved communities, making travel
                more accessible to everyone.
              </li>
              <li>
                <strong>Transparency and Growth:</strong> All transactions are visible, ensuring trust and fostering a
                community of support.
              </li>
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 sm:mt-6 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default HowItWorks;
