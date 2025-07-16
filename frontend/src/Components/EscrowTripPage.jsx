"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';

// ✅ TBNB deployed contract
const escrowAddress = "0xe0E3f59652Fe7ACB6C7A1F71BaA9754A69732E15";

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
  const [success, setSuccess] = useState(false); // <-- add success state
  const [fullPaid, setFullPaid] = useState(0);
  const [isFunded, setIsFunded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { communityId: paramCommunityId } = useParams();
  const location = useLocation();
  const communityId = location.state?.communityId || paramCommunityId;
  const estimatedCost = parseFloat(location.state?.estimatedCost || 0);
  const joinPaid = parseFloat(location.state?.joinPaid || 0);
  // Fetch escrow contract balance for the community
  const [escrowBalance, setEscrowBalance] = useState(0);
  useEffect(() => {
    const fetchEscrowBalance = async () => {
      if (!contract) return;
      try {
        const balance = await contract.getBalance();
        setEscrowBalance(parseFloat(ethers.utils.formatEther(balance)));
      } catch (err) {
        setEscrowBalance(0);
      }
    };
    fetchEscrowBalance();
  }, [contract]);
  const remaining = Math.max(estimatedCost - escrowBalance, 0).toFixed(4);

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
        // Remove setEthAmount(remaining) from useEffect/init
        // Use 'remaining' directly in the input and deposit logic
        fetchStatus(contractInstance);
        // Listen for fullPaidMembers for this community and user
        if (communityId && user) {
          const communityRef = doc(db, "communities", communityId);
          const unsub = onSnapshot(communityRef, (snap) => {
            if (snap.exists()) {
              const fullPaidMembers = snap.data().fullPaidMembers || {};
              const paid = parseFloat(fullPaidMembers[user] || 0);
              setFullPaid(paid);
              setIsFunded(paid >= estimatedCost);
            }
          });
          return () => unsub();
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    };
    init();
    // eslint-disable-next-line
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
      // Remove or increase the redirect delay
      // if (isFunded && communityId) {
      //   setTimeout(() => navigate(`/community/${communityId}`), 1500);
      // }
    } catch (err) {
      console.error("Error fetching contract data:", err);
    }
  };

  const deposit = async () => {
    if (!remaining || isNaN(remaining)) return alert("Enter valid amount");
    if (!contract) {
      console.error('Contract not initialized');
      return;
    }
    // Check if already funded
    const funded = await contract.isFunded();
    if (funded) {
      setErrorMsg("You have already funded this trip. No further payment is required.");
      return;
    }
    if (isFunded) {
      setErrorMsg("You have already funded this trip. No further payment is required.");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      const tx = await contract.deposit({
        value: ethers.utils.parseEther(remaining),
      });
      await tx.wait();
      // After successful deposit, update fullPaidMembers in Firestore
      if (communityId && account) {
        const communityRef = doc(db, "communities", communityId);
        const snap = await getDoc(communityRef);
        let fullPaidMembers = {};
        if (snap.exists()) {
          fullPaidMembers = snap.data().fullPaidMembers || {};
        }
        await updateDoc(communityRef, {
          fullPaidMembers: { ...fullPaidMembers, [account]: (parseFloat(fullPaidMembers[account] || 0) + parseFloat(remaining) + joinPaid).toString() },
        });
      }
      setSuccess(true);
      fetchStatus();
      // Show success alert and redirect
      setTimeout(() => navigate(`/community/${communityId}`), 1500);
    } catch (err) {
      console.error(err);
      if (err?.error?.message?.includes("Already funded") || (err?.reason && err.reason.includes("Already funded"))) {
        setErrorMsg("You have already funded this trip. No further payment is required.");
      } else {
        setErrorMsg("Deposit failed. " + (err?.reason || err?.message || ""));
      }
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
            <div className="mb-2 text-gray-700">Joining Amount Paid: <span className="font-bold">{joinPaid} ETH</span></div>
            <input
              type="number"
              value={remaining}
              readOnly
              placeholder="Enter ETH amount"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
            />
            <button
              onClick={deposit}
              disabled={loading || isFunded}
              className={`w-full ${loading ? "bg-indigo-400" : isFunded ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white py-3 rounded-lg font-semibold`}
            >
              {isFunded ? "Already Funded" : `Pay Remaining (${remaining} ETH)`}
            </button>
            {isFunded && (
              <div className="text-green-600 font-semibold mt-2">You have already funded this trip. No further payment is required.</div>
            )}
            {errorMsg && <div className="text-red-600 font-semibold mt-2">{errorMsg}</div>}
          </div>

          <div className="mt-6 text-center">
            <p><strong>Status:</strong></p>
            <p>🔐 Funded: {isFunded ? "Yes" : "No"}</p>
            <p>✅ Released: {status.isReleased ? "Yes" : "No"}</p>
            <p>💰 Escrow Balance: {escrowBalance} ETH</p>
          </div>

          {success && (
            <div className="text-green-600 font-bold text-lg mt-4">Payment successful! <button className="ml-2 px-4 py-2 bg-teal-600 text-white rounded" onClick={() => navigate(`/community/${communityId}`)}>Return to Community</button></div>
          )}

          {/* Only show admin controls if needed */}
        </div>
      </div>
    </>
  );
}
