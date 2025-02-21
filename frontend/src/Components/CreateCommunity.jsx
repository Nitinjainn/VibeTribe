import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ethers } from 'ethers';
import VibeTribeABI from '../../../backend/artifacts/contracts/VibeTribe.sol/VibeTribe.json';


const contractAddress = '0xcCcD28A937eB0bE71cC166360063Ae16EcE10163'; // Your deployed contract address

const CreateCommunity = ({ onClose, addCommunity }) => {
  const [communityName, setCommunityName] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [travelDates, setTravelDates] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize Ethereum connection
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        const signerInstance = providerInstance.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, VibeTribeABI.abi, signerInstance);
        setProvider(providerInstance);
        setSigner(signerInstance);
        setContract(contractInstance);
      } else {
        console.error('MetaMask is not installed.');
        alert('Please install MetaMask to interact with the blockchain.');
      }
    };
    initWeb3();
  }, []);

  const fetchImage = async (location) => {
    try {
      const apiKey = '0JaGxSb4iN0oPWKg6N6qqrb1qZr2LGMuQjDhQVKAH9w'; // Your Unsplash API key
      const url = `https://api.unsplash.com/search/photos?query=${location}&client_id=${apiKey}&per_page=1`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Error fetching from Unsplash:', response.statusText);
        return null;
      }

      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].urls.regular;
      } else {
        console.warn('No image found for the specified location.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      return null;
    }
  };
  //cost estimation 
  const estimateTravelCostAI = (location, peopleCount, travelDates, avgDistance) => {
    try {
      const baseFlightCostPerKm = 0.8;  // Avg flight cost per km ($0.1 per km)
      const avgHotelCostPerNight = 9.24;  // Avg cost per person per night
      const foodCostPerDay = 4;        // Avg daily food cost per person
      const miscExpenses = 5;          // Miscellaneous expenses per day
  
      // Extract travel month to adjust cost based on demand
      const travelMonth = new Date(travelDates).getMonth();
      let seasonalMultiplier = 1;
  
      if ([5, 6, 11, 12].includes(travelMonth)) {
        seasonalMultiplier = 1.3;  // Peak seasons (June, July, Nov, Dec) cost more
      } else if ([1, 2, 9].includes(travelMonth)) {
        seasonalMultiplier = 0.9;  // Off-season discounts
      }
  
      // Estimate flight cost based on user input distance
      const flightCost = avgDistance * baseFlightCostPerKm * peopleCount;
  
      // Estimate stay duration (default: 5 days)
      const stayDays = 5;
      const hotelCost = avgHotelCostPerNight * stayDays * peopleCount;
  
      // Food and miscellaneous expenses
      const foodCost = foodCostPerDay * stayDays * peopleCount;
      const miscCost = miscExpenses * stayDays * peopleCount;
  
      // Total estimated cost
      const totalCost = (flightCost + hotelCost + foodCost + miscCost) * seasonalMultiplier;
  
      // Cost per person
      const estimatedCostPerPerson = totalCost / peopleCount;
  
      return estimatedCostPerPerson.toFixed(2); // Return cost as a string with 2 decimals
    } catch (error) {
      console.error('Error in AI cost estimation:', error);
      return 'N/A';
    }
  };
  
  //end cost estimation
  const handleCreate = async (e) => {
    e.preventDefault();
  
    try {
      const imageSrc = await fetchImage(location);
      
      // Get avgDistance from user input
      const avgDistance = parseFloat(prompt('Enter the estimated travel distance in km:', '5000'));
  
      if (isNaN(avgDistance) || avgDistance <= 0) {
        alert('Invalid distance input. Please enter a valid number.');
        return;
      }
  
      const costEstimated = estimateTravelCostAI(location, peopleCount, travelDates, avgDistance);
  
      const newCommunity = {
        communityName,
        country,
        location,
        peopleCount: parseInt(peopleCount, 10),
        travelDates,
        description,
        imageSrc: imageSrc || 'https://via.placeholder.com/150',
        costEstimated, // AI-generated travel cost estimation
      };
  
      // Store in Firebase
      await addDoc(collection(db, 'communities'), newCommunity);
      console.log('Community added to Firestore');
  
      // Store on Blockchain
      if (contract) {
        const tx = await contract.createCommunity(
          communityName,
          country,
          location,
          peopleCount,
          travelDates,
          description,
          imageSrc,
          costEstimated
        );
        await tx.wait();
        console.log('Community stored on Blockchain');
      } else {
        console.error('Smart contract not initialized.');
      }
  
      addCommunity(newCommunity);
      alert('Community Created Successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Some features may have failed, but the community was created.');
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
                'USA', 'France', 'Japan', 'India', 'Canada', 'Germany', 'Australia', 'Italy', 'China',
                'Brazil', 'Russia', 'South Korea', 'South Africa', 'Mexico', 'Spain', 'Argentina',
                'Saudi Arabia', 'Turkey', 'Netherlands', 'Sweden', 'Switzerland', 'Indonesia',
                'New Zealand', 'Norway', 'Greece', 'Egypt', 'Ireland', 'Singapore', 'UAE', 'Israel',
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
              rows="4"
            ></textarea>
          </label>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-400 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg">Create Community</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
