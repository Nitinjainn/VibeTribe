import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FaShareAlt, FaHeart, FaTimes } from 'react-icons/fa';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ title, description, peopleJoined, imageSrc, onCardClick }) => {
  const handleShare = () => {
    const shareUrl = window.location.href + title.replace(/\s+/g, '-').toLowerCase();
    navigator.clipboard.writeText(shareUrl);
    alert(`Community link copied: ${shareUrl}`);
  };

  const handleFavorite = async () => {
    const favoriteData = { title, description, peopleJoined, imageSrc };

    try {
      await setDoc(doc(db, 'favorites', title), favoriteData);
      alert(`${title} has been added to your favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  return (
    <div
      className="bg-teal-100 rounded-lg shadow-lg w-80 max-h-[400px] p-4 relative transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={onCardClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite();
        }}
        className="absolute top-2 right-10 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-all"
      >
        <FaHeart />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        className="absolute top-2 right-2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-all"
      >
        <FaShareAlt />
      </button>
      <div className="overflow-hidden rounded-lg">
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover rounded-lg" />
      </div>
      <h4 className="text-teal-700 text-xl font-semibold mt-4">{title}</h4>
      <p className="text-gray-600 text-sm mt-2">{description}</p>
      <div className="flex justify-between items-center mt-6">
        <span className="text-gray-600 text-sm">{peopleJoined} people joined</span>
        <button className="bg-teal-700 text-white py-2 px-5 rounded-md hover:bg-teal-800 transition-all">
          Join Community
        </button>
      </div>
    </div>
  );
};

const CommunityCards = () => {
  const [communityData, setCommunityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().communityName || 'Untitled Community',
        description: doc.data().description || 'No description provided.',
        peopleJoined: doc.data().peopleCount || '0',
        imageSrc: doc.data().imageSrc || 'https://via.placeholder.com/400',
        travelDates: doc.data().travelDates || 'Date not available', // Fetch travel date
        location: doc.data().location || 'Location not specified', // Fetch travel location
      }));
      setCommunityData(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = communityData.filter((community) =>
      community?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [searchQuery, communityData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (community) => {
    setSelectedCommunity(community);
  };

  const closePopup = () => {
    setSelectedCommunity(null);
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="flex justify-center items-center py-12">
          <h1 className="text-3xl font-extrabold text-gray-800">Search for Communities</h1>
        </div>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search Communities"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-teal-500 rounded-md"
          />
        </div>

        {filteredCommunities.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 px-10 py-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                title={community.title}
                description={community.description}
                peopleJoined={community.peopleJoined}
                imageSrc={community.imageSrc}
                onCardClick={() => handleCardClick(community)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-lg text-gray-700 mb-4">
              There are no communities available. Create one now to get started!
            </p>
            <button
              onClick={() => navigate('/create-community')}
              className="bg-teal-700 text-white py-2 px-6 rounded-md hover:bg-teal-800 transition-all"
            >
              Create Community
            </button>
          </div>
        )}

        {filteredCommunities.length > 0 && (
          <div className="flex justify-center py-6">
            <button className="bg-teal-700 text-white py-2 px-6 rounded-md hover:bg-teal-800 transition-all">
              See More
            </button>
          </div>
        )}

        {selectedCommunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white shadow-xl rounded-lg p-8 w-full max-w-xl mx-4">
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={20} />
              </button>
              <div className="text-center">
                <img
                  src={selectedCommunity.imageSrc}
                  alt={selectedCommunity.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-teal-700">{selectedCommunity.title}</h2>
                <p className="text-gray-600 text-lg mt-2">{selectedCommunity.description}</p>
                <p className="text-gray-500 mt-4">
                  <strong>People Joined:</strong> {selectedCommunity.peopleJoined}
                </p>
                <p className="text-gray-500 mt-4">
                  <strong>Trip Date:</strong> {selectedCommunity.travelDates}
                </p>
                <p className="text-gray-500 mt-4">
                  <strong>Travel Location:</strong> {selectedCommunity.location}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityCards;
