import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import { FaShareAlt, FaHeart, FaEthereum, FaUsers } from 'react-icons/fa';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ id, title, description, peopleJoined, imageSrc, costEstimated, maxMembers }) => {
  const navigate = useNavigate();
  
  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = window.location.href + title.replace(/\s+/g, '-').toLowerCase();
    try {
      navigator.clipboard.writeText(shareUrl);
      alert(`Community link copied: ${shareUrl}`);
    } catch (error) {
      console.error('Clipboard write error:', error);
      alert('Unable to copy link. Please try manually.');
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    const safeTitle = title.replace(/\s+/g, '_');
    const favoriteData = { title, description, peopleJoined, imageSrc, costEstimated };

    try {
      await setDoc(doc(db, 'favorites', safeTitle), favoriteData);
      alert(`${title} has been added to your favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  return (
    <div
      className="backdrop-blur-lg bg-teal-100/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-80 max-h-[450px] p-4 relative transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)] cursor-pointer border border-teal-100/20"
      onClick={() => navigate(`/community/${id}`)}
    >
      <div className="absolute -top-2 -right-2 flex gap-2 z-10">
        <button
          onClick={handleFavorite}
          className="bg-teal-600/80 backdrop-blur-sm text-white p-2.5 rounded-xl hover:bg-teal-700/90 transition-all duration-300 shadow-lg"
        >
          <FaHeart className="w-4 h-4" />
        </button>
        <button
          onClick={handleShare}
          className="bg-teal-600/80 backdrop-blur-sm text-white p-2.5 rounded-xl hover:bg-teal-700/90 transition-all duration-300 shadow-lg"
        >
          <FaShareAlt className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl relative group">
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm">{description}</p>
        </div>
      </div>

      <h4 className="text-teal-700 text-xl font-bold mt-4 line-clamp-1">{title}</h4>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-2 mt-3">
        <FaEthereum className="text-teal-700 w-5 h-5" />
        <p className="text-gray-600 text-sm">Estimated Cost: <span className="font-semibold">{costEstimated} $</span></p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <FaUsers className="text-teal-700 w-4 h-4" />
          <span className="text-gray-600 text-sm">{peopleJoined} / {maxMembers || '∞'} Members</span>
        </div>
        <button className="bg-teal-700/90 backdrop-blur-sm text-white py-2 px-5 rounded-xl hover:bg-teal-800/90 transition-all duration-300 shadow-lg">
          Join Now
        </button>
      </div>
    </div>
  );
};

CommunityCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  peopleJoined: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  costEstimated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxMembers: PropTypes.number,
};

const CommunityCards = () => {
  const [communityData, setCommunityData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().communityName || 'Untitled Community',
        description: doc.data().description || 'No description provided.',
        peopleJoined: parseInt(doc.data().peopleCount, 10) || 0,
        imageSrc: doc.data().imageSrc || 'https://via.placeholder.com/400',
        travelDates: doc.data().travelDates || 'Date not available',
        location: doc.data().location || 'Location not specified',
        costEstimated: doc.data().costEstimated || 'Not available',
        maxMembers: doc.data().maxMembers || null,
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white relative pt-16">
        <div className="relative">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <h1 className="text-4xl font-extrabold text-teal-700 bg-clip-text">
              Discover Communities
            </h1>
            
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search Communities"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-6 py-3 bg-white/40 backdrop-blur-md border border-teal-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all duration-300 shadow-lg"
              />
            </div>
          </div>

          {filteredCommunities.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 px-6 md:px-10 py-6 animate-fadeIn">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  title={community.title}
                  description={community.description}
                  peopleJoined={community.peopleJoined}
                  imageSrc={community.imageSrc}
                  costEstimated={community.costEstimated}
                  maxMembers={community.maxMembers}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-teal-100/20">
                <p className="text-xl text-teal-700 mb-6">
                  No communities found. Be the first to create one!
                </p>
                <button
                  onClick={() => navigate('/create-community')}
                  className="bg-teal-700/90 backdrop-blur-sm text-white py-3 px-8 rounded-xl hover:bg-teal-800/90 transition-all duration-300 shadow-lg font-medium"
                >
                  Create Community
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityCards;
