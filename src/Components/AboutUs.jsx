import React from 'react';
import Navbar from './Navbar';

const AboutUs = () => {
  return (
    <>
    <Navbar/>
    <div className="relative w-full min-h-screen flex justify-center items-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
          About VibeTribe
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8">
          At VibeTribe, we believe travel is more than just a getaway; it's a shared experience. Our platform empowers
          travelers to come together, share resources, and create memorable journeys. Whether you're a solo adventurer
          or part of a group, we make travel more accessible and impactful.
        </p>
        <div className="space-y-6 text-left text-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-base sm:text-lg">
            Our mission is to revolutionize the way people travel by creating a community-driven platform that supports
            affordable travel for all. We connect like-minded individuals who want to explore the world together, share
            resources, and fund their travel goals collaboratively.
          </p>
        </div>

        <div className="space-y-6 text-left text-gray-700 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
            <li>
              <strong>Community Funding:</strong> Our members pool their resources together to help each other fund
              travel goals and expenses.
            </li>
            <li>
              <strong>Travel Loans:</strong> We provide low-interest loans to those who need extra funds to complete their
              journey.
            </li>
            <li>
              <strong>Collaborative Travel:</strong> Find fellow travelers with similar interests and make your journeys
              more enjoyable and affordable.
            </li>
            <li>
              <strong>Transparency:</strong> Every transaction and contribution is visible to all members, fostering trust
              and openness.
            </li>
          </ul>
        </div>

        <div className="space-y-6 text-left text-gray-700 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Join the VibeTribe</h2>
          <p className="text-base sm:text-lg">
            Join us at VibeTribe and be part of a community that believes in the power of shared experiences. Together, we
            can make travel more affordable, fun, and meaningful.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
