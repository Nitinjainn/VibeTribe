import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Set up a real-time listener for the 'favorites' collection
    const unsubscribe = onSnapshot(collection(db, 'favorites'), (snapshot) => {
      const favData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favData);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleRemove = async (id) => {
    await deleteDoc(doc(db, 'favorites', id));
    alert('Favorite removed successfully!');
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center py-12 px-6">
        <h1 className="text-3xl font-extrabold text-teal-800">Your Favorites</h1>
      </div>

      {/* No Favorites */}
      {favorites.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-6 text-center">
          <div className="text-6xl text-teal-600 animate-heart-break">
            <i className="fas fa-heart-broken"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600">
            No favorites yet! Start adding some.
          </h2>
          <p className="text-gray-500 text-lg">Explore new destinations and make them your favorites!</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 px-10 py-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-xl shadow-2xl w-full sm:w-80 max-h-[400px] p-6 relative transition-transform transform hover:scale-105 hover:shadow-3xl hover:border-teal-500 border border-transparent"
            >
              <button
                onClick={() => handleRemove(favorite.id)}
                className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-lg"
              >
                <i className="fas fa-trash-alt text-xl"></i>
              </button>
              <div className="overflow-hidden rounded-xl">
                <img
                  src={favorite.imageSrc}
                  alt={favorite.title}
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                />
              </div>
              <h4 className="text-teal-700 text-xl font-semibold mt-4">{favorite.title}</h4>
              <p className="text-gray-600 text-sm mt-2">{favorite.description}</p>
              <div className="text-gray-600 text-sm mt-6">
                {favorite.peopleJoined} people joined
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Favorites;
