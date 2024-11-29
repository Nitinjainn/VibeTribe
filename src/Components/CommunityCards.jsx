import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FaShareAlt, FaHeart } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CommunityCard = ({ title, description, peopleJoined, imageSrc }) => {
  const handleShare = () => {
    const shareUrl = window.location.href + title.replace(/\s+/g, '-').toLowerCase(); // Generate a shareable link
    navigator.clipboard.writeText(shareUrl);
    alert(`Community link copied: ${shareUrl}`);
  };

  const handleFavorite = async () => {
    const favoriteData = { title, description, peopleJoined, imageSrc };

    try {
      // Add a new document to the 'favorites' collection with a unique ID
      await setDoc(doc(db, 'favorites', title), favoriteData);
      alert(`${title} has been added to your favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  return (
    <div className="bg-teal-100 rounded-lg shadow-lg w-80 max-h-[400px] p-4 relative transition-transform transform hover:scale-105 hover:shadow-2xl">
      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        className="absolute top-2 right-10 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-all">
        <FaHeart />
      </button>
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute top-2 right-2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-all">
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
          <a href="/InerCard">Join Community</a>
        </button>
      </div>
    </div>
  );
};

const CommunityCards = () => {
  const [communityData, setCommunityData] = useState([
    { title: 'Trip to Manali', description: 'Join the community for a trip to the mountains.', peopleJoined: '250+', imageSrc: 'https://www.justahotels.com/wp-content/uploads/2023/07/Manali-Travel-Guide.jpg' },
    { title: 'Explore Goa', description: 'A community adventure to the beaches of Goa.', peopleJoined: '300+', imageSrc: 'https://wemusttravel.in/wp-content/uploads/2019/06/Goa-sunset-4.jpg' },
    { title: 'Ladakh Journey', description: 'Experience the stunning landscapes of Ladakh.', peopleJoined: '200+', imageSrc: 'https://www.lehladakhindia.com/wp-content/uploads/2024/07/ladakh-by-road-22.jpeg' },
    { title: 'Rajasthan Safari', description: 'Discover the royal heritage of Rajasthan.', peopleJoined: '150+', imageSrc: 'https://lh7-us.googleusercontent.com/eGaRpuYaooIGNqSeodNjWK_n_Qjbnl9MLgAt97k7KZPyB2-EYlls1Pv7_24oogSSK2bIVY1mI9DwEUL4ahfWr7KDlqqNVkWI4MmI9T36-XgykdJsDn2abbcJ-aAghn8S1GLSr52HrRmuDNEq-yn8lQA' },
    { title: 'Backpacking in Kerala', description: 'Join us for an exploration of Kerala’s beauty.', peopleJoined: '180+', imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqCkzs9WIDTAahMcFBCBTuO9fK5N8uYiFoCw&s' },
    { title: 'HongKong DisneyLand', description: 'Join us for an exploration of HonKong.', peopleJoined: '180+', imageSrc: 'https://www.flamingotravels.co.in/blog/wp-content/uploads/2023/08/Disneyland-Hongkong.png' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState(communityData);

  useEffect(() => {
    const filtered = communityData.filter(community =>
      community.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [searchQuery, communityData]);

  const fetchCommunityImage = async (location) => {
    const apiKey = '0JaGxSb4iN0oPWKg6N6qqrb1qZr2LGMuQjDhQVKAH9w'; // Replace with your Unsplash API Key
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${location}&client_id=${apiKey}&per_page=1`);
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].urls.small;
      }
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
    }
    return ''; // Return an empty string if no image is found or an error occurs
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="flex justify-center items-center py-12">
          <h1 className="text-3xl font-extrabold text-gray-800">Search for Communities</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search Communities"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-teal-500 rounded-md"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-8 px-10 py-6">
          {filteredCommunities.map((community, index) => (
            <CommunityCard
              key={index}
              title={community.title}
              description={community.description}
              peopleJoined={community.peopleJoined}
              imageSrc={community.imageSrc || ''} // Fallback in case no image is fetched
            />
          ))}
        </div>
        

        {/* See More Button */}
        <div className="flex justify-center py-6">
          <button className="bg-teal-700 text-white py-2 px-6 rounded-md hover:bg-teal-800 transition-all">
            See More
          </button>
        </div>
      </div>
    </>
  );
};

export default CommunityCards;
