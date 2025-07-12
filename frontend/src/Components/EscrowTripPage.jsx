"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import { useNavigate, useParams } from 'react-router-dom';

// ✅ TBNB deployed contract
const escrowAddress = "0xae7c49a6d9AF8D2FFb9d6E0105C592a1194fB6FD";

const abi = [
 {
    "inputs": [{ "internalType": "address", "name": "_payee", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "amount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isFunded",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isReleased",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "payee",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "payer",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function EscrowTripPage() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [ethAmount, setEthAmount] = useState("");
  const [status, setStatus] = useState({});
  const [admin, setAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { communityId } = useParams();

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask.");
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const user = await signer.getAddress();
        const contractInstance = new ethers.Contract(escrowAddress, abi, signer);
        setContract(contractInstance);
        setAccount(user);
        // Fetch cost from contract
        const cost = await contractInstance.amount();
        setEthAmount(ethers.utils.formatEther(cost));
        fetchStatus(contractInstance);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    };
    init();
  }, []);

  const fetchStatus = async (c = contract) => {
    if (!c) return;
    try {
      const isFunded = await c.isFunded();
      const isReleased = await c.isReleased();
      const balance = await c.getBalance();
      setStatus({
        isFunded,
        isReleased,
        balance: ethers.utils.formatEther(balance),
      });
      // If funded, redirect to community page
      if (isFunded && communityId) {
        setTimeout(() => navigate(`/community/${communityId}`), 1500);
      }
    } catch (err) {
      console.error("Error fetching contract data:", err);
    }
  };

  const deposit = async () => {
    if (!ethAmount || isNaN(ethAmount)) return alert("Enter valid amount");
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }
    try {
      setLoading(true);
      const tx = await contract.deposit({
        value: ethers.utils.parseEther(ethAmount),
      });
      await tx.wait();
      alert("Funds deposited!");
      fetchStatus();
    } catch (err) {
      console.error(err);
      alert("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  const releaseFunds = async () => {
    try {
      setLoading(true);
      const tx = await contract.releaseFunds();
      await tx.wait();
      alert("Funds released!");
      fetchStatus();
    } catch (err) {
      console.error(err);
      alert("Release failed.");
    } finally {
      setLoading(false);
    }
  };

  const refund = async () => {
    try {
      setLoading(true);
      const tx = await contract.refund();
      await tx.wait();
      alert("Refund processed!");
      fetchStatus();
    } catch (err) {
      console.error(err);
      alert("Refund failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-6">
        <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-4">Trip Escrow System</h2>
          <p className="text-gray-600 text-center mb-2">
            Wallet: <span className="font-mono">{account}</span>
          </p>

          <div className="mt-4">
            <input
              type="number"
              value={ethAmount}
              readOnly
              placeholder="Enter ETH amount"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
            />
            <button
              onClick={deposit}
              disabled={loading}
              className={`w-full ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-3 rounded-lg font-semibold`}
            >
              Pay for Trip (Lock in Escrow)
            </button>
          </div>

          <div className="mt-6 text-center">
            <p><strong>Status:</strong></p>
            <p>🔐 Funded: {status.isFunded ? "Yes" : "No"}</p>
            <p>✅ Released: {status.isReleased ? "Yes" : "No"}</p>
            <p>💰 Escrow Balance: {status.balance || 0} ETH</p>
          </div>

          {account.toLowerCase() === admin.toLowerCase() && (
            <div className="mt-6 space-y-3">
              <button
                onClick={releaseFunds}
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                } text-white py-3 rounded-lg font-semibold`}
              >
                Release Funds to Trip Provider
              </button>
              <button
                onClick={refund}
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                } text-white py-3 rounded-lg font-semibold`}
              >
                Refund to Payer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
