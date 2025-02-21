import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from './Navbar';

const contractAddress = "0x217Ed132D52A8bb17F5805406f4c6AB9AF82775C";
const abi = [
  {
    "inputs": [],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "user","type": "address"}],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const DonationPage = () => {
  const [account, setAccount] = useState("");
  const [donationAmountETH, setDonationAmountETH] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMess, setErrorMess] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
      } else {
        alert("Please install MetaMask!");
      }
    };
    connectWallet();
  }, []);

  // Invest ETH into the contract
  const investFunds = async () => {
    if (!window.ethereum) return alert("MetaMask is required");
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.invest({ value: ethers.parseEther(donationAmountETH) });
      await tx.wait();
      
      alert(`Invested ${donationAmountETH} ETH successfully!`);
      setDonationAmountETH("");
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMess("Transaction failed. Please check your input and try again.");
    }
    setLoading(false);
  };

  // Get user's stored balance
  const getBalance = async () => {
    if (!window.ethereum) return alert("MetaMask is required");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const userBalance = await contract.getBalance(account);
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-100 to-white p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-teal-600 text-center">InvestCycle</h1>
          <p className="text-gray-600 text-center mt-2">
            A platform where travelers can pool resources monthly for shared contributions.
          </p>
          
          <h2 className="text-2xl font-semibold text-teal-600 mb-4 text-center">Contribute in ETH</h2>
          <p className="text-gray-700 text-center mb-4">
            <span className="font-medium">Connected Account:</span> {account || "Not connected"}
          </p>

          <input
            type="number"
            placeholder="Enter amount in ETH"
            value={donationAmountETH}
            onChange={(e) => setDonationAmountETH(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <button
            onClick={investFunds}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            } transition-colors`}
          >
            {loading ? "Processing..." : "Contribute in ETH"}
          </button>

          <button
            onClick={getBalance}
            className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Check Balance
          </button>

          {balance !== null && (
            <p className="text-center mt-3 text-gray-700">
              <strong>Your Balance:</strong> {balance} ETH
            </p>
          )}

          {errorMess && <p className="text-red-600 mt-4 text-center">{errorMess}</p>}
        </div>
      </div>
    </>
  );
};

export default DonationPage;
