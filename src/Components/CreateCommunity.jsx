import React, { useState } from 'react';

const CreateCommunity = ({ onClose }) => {
  const [communityName, setCommunityName] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [travelDates, setTravelDates] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    alert("Community Created Successfully!");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-white to-gray-200 backdrop-blur-lg"
    >
      <div className="relative bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl mx-4 h-full max-h-[90vh] overflow-y-auto transition-transform duration-500 transform scale-100">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6 tracking-wide">Create Your Community</h2>
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
              <option value="USA">United States</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="Brazil">Brazil</option>
              <option value="Germany">Germany</option>
              <option value="Italy">Italy</option>
              <option value="South Korea">South Korea</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="China">China</option>
              <option value="South Africa">South Africa</option>
              <option value="Mexico">Mexico</option>
              <option value="Spain">Spain</option>
              <option value="Pakistan">Pakistan</option>
              {/* Add additional countries as needed */}
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
