import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Firebase Firestore functions

const CreateCommunity = ({ onClose, addCommunity }) => {
  const [communityName, setCommunityName] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [travelDates, setTravelDates] = useState('');
  const [description, setDescription] = useState('');

  const fetchImage = async (location) => {
    try {
      const apiKey = '0JaGxSb4iN0oPWKg6N6qqrb1qZr2LGMuQjDhQVKAH9w'; // Replace with your Unsplash API key
      const url = `https://api.unsplash.com/search/photos?query=${location}&client_id=${apiKey}&per_page=1`;
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error('Error fetching from Unsplash:', response.statusText);
        return null;
      }
  
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].urls.regular; // Use a high-quality image URL
      } else {
        console.warn('No image found for the specified location.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      return null;
    }
  };
  
  

  const handleCreate = async (e) => {
    e.preventDefault();
  
    try {
      const imageSrc = await fetchImage(location);
  
      const newCommunity = {
        communityName,
        country,
        location,
        peopleCount: parseInt(peopleCount, 10), // Ensure integer
        travelDates,
        description,
        imageSrc: imageSrc || 'https://via.placeholder.com/150', // Default image if fetching fails
      };
  
      await addDoc(collection(db, 'communities'), newCommunity);
      console.log('Community added to Firestore');
  
      addCommunity(newCommunity);
      alert('Community Created Successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Some features may have failed (e.g., image fetch), but the community was created.');
    }
  };
  

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-white to-gray-200 backdrop-blur-lg">
      <div className="relative bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl mx-4 h-full max-h-[90vh] overflow-y-auto transition-transform duration-500 transform scale-100">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6 tracking-wide">
          Create Your Community
        </h2>
        <form onSubmit={handleCreate} className="space-y-6">
          <label className="block text-gray-700 font-semibold">
            Community Name
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter community name"
              required
            />
          </label>

          <label className="block text-gray-700 font-semibold">
            Select Country
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Choose a country</option>
              {[
                'USA',
                'France',
                'Japan',
                'India',
                'Canada',
                'Germany',
                'Australia',
                'Italy',
                'China',
                'Brazil',
                'Russia',
                'South Korea',
                'South Africa',
                'Mexico',
                'Spain',
                'Argentina',
                'Saudi Arabia',
                'Turkey',
                'Netherlands',
                'Sweden',
                'Switzerland',
                'Indonesia',
                'New Zealand',
                'Norway',
                'Greece',
                'Egypt',
                'Ireland',
                'Singapore',
                'UAE',
                'Israel',
              ].map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-gray-700 font-semibold">
            Travel Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter travel location"
              required
            />
          </label>

          <label className="block text-gray-700 font-semibold">
            Maximum Members
            <input
              type="number"
              min="1"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter maximum number of members"
              required
            />
          </label>

          <label className="block text-gray-700 font-semibold">
            Travel Date
            <input
              type="date"
              value={travelDates}
              onChange={(e) => setTravelDates(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </label>

          <label className="block text-gray-700 font-semibold">
            Community Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Describe your community purpose"
              rows="4"
            ></textarea>
          </label>

          <div className="flex justify-end items-center gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-400 text-gray-800 hover:bg-gray-500 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all focus:outline-none"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
