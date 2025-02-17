import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Message } from "semantic-ui-react";
import Navbar from './Navbar';

const DonationPage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [donationAmountETH, setDonationAmountETH] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMess, setErrorMess] = useState("");

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("User denied account access:", error);
        }
      } else {
        alert("Please install MetaMask to use blockchain donation.");
      }
    };
    initializeWeb3();
  }, []);

  const verifyMetaMaskAccount = () => {
    if (web3 && account) {
      setIsVerified(true);
      alert("MetaMask account verified.");
    } else {
      alert("Please connect to MetaMask first.");
    }
  };

  const handleETHDonation = async () => {
    if (web3 && account && isVerified) {
      const weiAmount = web3.utils.toWei(donationAmountETH, "ether");
      setLoading(true);
      try {
        await web3.eth.sendTransaction({
          from: account,
          to: "0x9E268c57200DF4B9b3Ae84882Ed4e347F5441625", // Replace with your receiver address
          value: weiAmount,
        });
        setConfirmationMessage(`Thank you for donating ${donationAmountETH} ETH!`);
        setShowConfirmationModal(true);
      } catch (error) {
        console.error("Transaction failed:", error);
        setErrorMess("Transaction failed. Please check your input and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please verify your MetaMask account before proceeding.");
    }
  };

  const closeModal = () => setShowConfirmationModal(false);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-100 to-white p-6">
      {/* Main Container */}
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-teal-600">MakePayment</h1>
          <p className="text-gray-600 mt-2">
            A platform where travelers can pool resources monthly to help each other achieve travel goals through shared contributions and support.
          </p>
        </div>

        {/* Donation Form */}
        <div>
          <h2 className="text-2xl font-semibold text-teal-600 mb-4 text-center">Contribute in ETH</h2>
          <p className="text-gray-700 mb-4 text-center">
            <span className="font-medium">Connected Account:</span>{" "}
            {account || "Not connected"}
          </p>
          <input
            type="text"
            placeholder="Enter amount in ETH"
            value={donationAmountETH}
            onChange={(e) => setDonationAmountETH(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <button
            onClick={verifyMetaMaskAccount}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Verify MetaMask Account
          </button>
          <button
            onClick={handleETHDonation}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            } transition-colors`}
          >
            {loading ? "Processing..." : "Contribute in ETH"}
          </button>
          {errorMess && <Message negative className="mt-4">{errorMess}</Message>}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-5">
          <div className="bg-white p-6 rounded-lg text-center max-w-sm w-full shadow-lg">
            <h2 className="text-2xl font-bold text-teal-600 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">{confirmationMessage}</p>
            <button
              onClick={closeModal}
              className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DonationPage;
