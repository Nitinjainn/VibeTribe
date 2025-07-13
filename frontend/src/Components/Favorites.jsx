import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    setLoading(true);
    // Set up a real-time listener for the 'favorites' collection
    const unsubscribe = onSnapshot(collection(db, 'favorites'), (snapshot) => {
      const favData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favData);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, 'favorites', id));
      // Toast notification would be better than alert
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getSortedFavorites = () => {
    switch (sortBy) {
      case 'popular':
        return [...favorites].sort((a, b) => b.peopleJoined - a.peopleJoined);
      case 'alphabetical':
        return [...favorites].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return favorites; // recent (default order from Firebase)
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white relative pt-16">
        <div className="relative">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <h1 className="text-4xl font-extrabold text-teal-700 bg-clip-text">
              Your Favorites
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your curated collection of travel experiences on the blockchain
            </p>
          </div>

          {/* Sort Controls */}
          {favorites.length > 0 && (
            <div className="max-w-6xl mx-auto mb-8 flex justify-end">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-green-100">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'recent' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'popular' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  Most Popular
                </button>
                <button
                  onClick={() => setSortBy('alphabetical')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'alphabetical' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  A-Z
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto text-center border border-green-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Saved Experiences Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start exploring and save your favorite travel experiences to your personal collection on the blockchain.
              </p>
              <button className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all transform hover:scale-105">
                Explore Experiences
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {getSortedFavorites().map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-200 hover:transform hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img
                      src={favorite.imageSrc}
                      alt={favorite.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleRemove(favorite.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors group"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {favorite.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {favorite.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {favorite.peopleJoined} joined
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
