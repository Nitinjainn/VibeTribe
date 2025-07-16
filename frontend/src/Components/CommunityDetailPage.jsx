import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot, updateDoc, runTransaction, collection, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  FaEthereum,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaShieldAlt,
  FaCube,
} from "react-icons/fa";
import Navbar from "./Navbar";
import metamaskAuth from '../utils/metamaskAuth';
import { useState as useModalState } from 'react';
import EscrowTripPage from "./EscrowTripPage";
import { ethers } from "ethers";
import ProposalForm from './ProposalForm';
import ProposalList from './ProposalList';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useModalState(false);
  const [authError, setAuthError] = useModalState("");
  const [authLoading, setAuthLoading] = useModalState(false);
  const [members, setMembers] = useState([]);
  const [maxMembers, setMaxMembers] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState([]);
  const navigate = useNavigate();
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowError, setEscrowError] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [escrowStatus, setEscrowStatus] = useState({ isFunded: false });
  const [votingContract, setVotingContract] = useState(null);
  const [votingAddress, setVotingAddress] = useState("");
  const [proposals, setProposals] = useState([]);
  const [votingStatus, setVotingStatus] = useState({});
  const [votingLoading, setVotingLoading] = useState(false);
  const [joinPaidMembers, setJoinPaidMembers] = useState({});
  const [fullPaidMembers, setFullPaidMembers] = useState({});

  const escrowAddress = "0x8a0B09ad25905049A488bB8596eEe81c4F705475";
  const escrowAbi = [
    "function isFunded() public view returns (bool)",
    "function deposit() payable",
  ];

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const docRef = doc(db, "communities", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCommunity({
            id: docSnap.id,
            ...docSnap.data(),
            title: docSnap.data().communityName || "Untitled Community",
            description: docSnap.data().description || "No description provided.",
            peopleJoined: parseInt(docSnap.data().peopleCount, 10) || 0,
            imageSrc: docSnap.data().imageSrc || "https://via.placeholder.com/400",
            travelDates: docSnap.data().travelDates || "Date not available",
            location: docSnap.data().location || "Location not specified",
            costEstimated: docSnap.data().costEstimated || "Not available",
          });
        }
      } catch (error) {
        console.error("Error fetching community:", error);
      }
    };
    fetchCommunity();
  }, [id]);

  useEffect(() => {
    // Real-time listener for community
    const docRef = doc(db, "communities", id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCommunity({
          id: docSnap.id,
          ...data,
          title: data.communityName || "Untitled Community",
          description: data.description || "No description provided.",
          peopleJoined: Array.isArray(data.members) ? data.members.length : 0,
          imageSrc: data.imageSrc || "https://via.placeholder.com/400",
          travelDates: data.travelDates || "Date not available",
          location: data.location || "Location not specified",
          costEstimated: data.costEstimated || "Not available",
        });
        setMembers(Array.isArray(data.members) ? data.members : []);
        setMaxMembers(data.maxMembers || 0);
        setIsMember(Array.isArray(data.members) && walletAddress ? data.members.includes(walletAddress) : false);
      }
    });
    return () => unsub();
  }, [id, walletAddress]);

  // Real-time listener for messages
  useEffect(() => {
    if (!id) return;
    const messagesRef = collection(db, "communities", id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, [id]);

  // Fetch member profiles (names) in real time
  useEffect(() => {
    if (!members.length) {
      setMemberProfiles([]);
      return;
    }
    let isMounted = true;
    Promise.all(
      members.map(async (addr) => {
        const userDoc = await getDoc(doc(db, "users", addr));
        return userDoc.exists() ? { address: addr, name: userDoc.data().name || addr } : { address: addr, name: addr };
      })
    ).then((profiles) => {
      if (isMounted) setMemberProfiles(profiles);
    });
    return () => { isMounted = false; };
  }, [members]);

  // Fetch joinPaidMembers and fullPaidMembers from Firestore
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "communities", id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setJoinPaidMembers(data.joinPaidMembers || {});
        setFullPaidMembers(data.fullPaidMembers || {});
      }
    });
    return () => unsub();
  }, [id]);

  // MetaMask connection logic
  useEffect(() => {
    if (metamaskAuth.isAuthenticated()) {
      const user = metamaskAuth.getCurrentUser();
      setWalletAddress(user?.address || "");
      setIsConnected(true);
    } else {
      setShowConnectModal(true);
    }
  }, []);

  const handleMetaMaskAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    const result = await metamaskAuth.authenticate();
    setAuthLoading(false);
    if (result.success) {
      setWalletAddress(result.userData.address);
      setIsConnected(true);
      setShowConnectModal(false);
    } else {
      // If error is due to no user found, redirect to signup with wallet address
      if (result.error && result.error.toLowerCase().includes('not found')) {
        navigate('/signup', { state: { walletAddress: metamaskAuth.address } });
      } else {
        setAuthError(result.error || "MetaMask authentication failed.");
      }
    }
  };

  const handleJoinCommunity = async () => {
    if (!walletAddress || isMember || members.length >= maxMembers) return;
    setShowEscrowModal(true);
  };

  const handleEscrowPay = async () => {
    setEscrowLoading(true);
    setEscrowError("");
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask.");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(escrowAddress, escrowAbi, signer);
      // Fixed joining fee
      const joiningFee = "0.0001";
      // On-chain payment
      const tx = await contract.deposit({ value: ethers.utils.parseEther(joiningFee) });
      await tx.wait();
      // Off-chain: update joinPaidMembers and add user to community
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(communityRef);
        if (!docSnap.exists()) throw new Error("Community does not exist");
        const data = docSnap.data();
        const currentMembers = Array.isArray(data.members) ? data.members : [];
        const memberJoinTimestamps = data.memberJoinTimestamps || {};
        const joinPaidMembers = data.joinPaidMembers || {};
        if (currentMembers.includes(walletAddress)) return;
        if (currentMembers.length >= data.maxMembers) throw new Error("Community is full");
        transaction.update(communityRef, {
          members: [...currentMembers, walletAddress],
          peopleCount: currentMembers.length + 1,
          memberJoinTimestamps: { ...memberJoinTimestamps, [walletAddress]: Date.now() },
          joinPaidMembers: { ...joinPaidMembers, [walletAddress]: joiningFee },
        });
      });
      setIsMember(true);
      setShowEscrowModal(false);
    } catch (err) {
      setEscrowError(err.message || "Payment failed.");
    } finally {
      setEscrowLoading(false);
    }
  };

  const addUserToCommunity = async () => {
    const communityRef = doc(db, "communities", id);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(communityRef);
      if (!docSnap.exists()) throw new Error("Community does not exist");
      const data = docSnap.data();
      const currentMembers = Array.isArray(data.members) ? data.members : [];
      const memberJoinTimestamps = data.memberJoinTimestamps || {};
      if (currentMembers.includes(walletAddress)) return;
      if (currentMembers.length >= data.maxMembers) throw new Error("Community is full");
      transaction.update(communityRef, {
        members: [...currentMembers, walletAddress],
        peopleCount: currentMembers.length + 1,
        memberJoinTimestamps: { ...memberJoinTimestamps, [walletAddress]: Date.now() },
      });
    });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !walletAddress) return;
    const messagesRef = collection(db, "communities", id, "messages");
    await addDoc(messagesRef, {
      text: messageInput.trim(),
      sender: walletAddress,
      timestamp: new Date(),
    });
    setMessageInput("");
  };

  const handleWalletButton = async () => {
    if (!isConnected) {
      setShowConnectModal(true);
    }
  };

  // Check if community is full and all members have paid (simplified: all members joined)
  const isCommunityFull = members.length === maxMembers && maxMembers > 0;
  // Has the user paid the join fee?
  const hasPaidJoin = !!joinPaidMembers[walletAddress];
  const allPaidJoin = Object.keys(joinPaidMembers).length === maxMembers && Object.values(joinPaidMembers).every(a => parseFloat(a) > 0);

  // Helper for case-insensitive address lookup
  const getPaidAmount = (obj, addr) => {
    if (!addr) return 0;
    const key = Object.keys(obj).find(k => k.toLowerCase() === addr.toLowerCase());
    return key ? parseFloat(obj[key]) : 0;
  };
  const joinPaid = getPaidAmount(joinPaidMembers, walletAddress);
  const fullPaid = getPaidAmount(fullPaidMembers, walletAddress);
  const estimatedCost = parseFloat(community?.costEstimated || 0);
  const remaining = Math.max(estimatedCost - joinPaid, 0).toFixed(4);
  const hasPaidFull = fullPaid >= estimatedCost;
  const allPaidFull = Object.keys(fullPaidMembers).length === maxMembers && Object.values(fullPaidMembers).every(a => parseFloat(a) >= estimatedCost);

  // Fetch or deploy TripVoting contract
  useEffect(() => {
    const fetchOrDeployVoting = async () => {
      if (!isCommunityFull || !isMember) return;
      setVotingLoading(true);
      try {
        // 1. Check Firestore for voting contract address
        const docRef = doc(db, 'communities', id);
        const docSnap = await getDoc(docRef);
        let votingAddr = docSnap.data()?.votingContract;
        let contract;
        if (!votingAddr) {
          // 2. Deploy TripVoting contract if not present
          if (!window.ethereum) throw new Error('MetaMask required');
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
          // Load ABI and bytecode (assume ABI/bytecode are available, e.g. import TripVoting.json)
          const tripVotingArtifact = await import('../abis/TripVoting.json');
          const factory = new ethers.ContractFactory(tripVotingArtifact.abi, tripVotingArtifact.bytecode, signer);
          const tx = await factory.deploy(members);
          await tx.deployed();
          votingAddr = tx.address;
          // Save to Firestore
          await updateDoc(docRef, { votingContract: votingAddr });
          contract = tx;
        } else {
          // 3. Connect to existing contract
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
          const tripVotingArtifact = await import('../abis/TripVoting.json');
          contract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
        }
        setVotingAddress(votingAddr);
        setVotingContract(contract);
      } catch (err) {
        console.error('Voting contract error:', err);
      } finally {
        setVotingLoading(false);
      }
    };
    fetchOrDeployVoting();
    // eslint-disable-next-line
  }, [isCommunityFull, isMember, members]);

  // Fetch proposals from contract
  useEffect(() => {
    const fetchProposals = async () => {
      if (!votingContract) return;
      try {
        const count = await votingContract.getProposalCount();
        const arr = [];
        for (let i = 0; i < count; i++) {
          const p = await votingContract.getProposal(i);
          arr.push({
            description: p[0],
            yesVotes: Number(p[1]),
            noVotes: Number(p[2]),
            endTime: Number(p[3]),
            passed: p[4],
            executed: p[4] !== undefined, // crude: if passed is set, assume executed
          });
        }
        setProposals(arr);
      } catch (err) {
        console.error('Fetch proposals error:', err);
      }
    };
    fetchProposals();
  }, [votingContract]);

  // Voting status per proposal
  useEffect(() => {
    const fetchVotingStatus = async () => {
      if (!votingContract || !walletAddress) return;
      try {
        const arr = [];
        for (let i = 0; i < proposals.length; i++) {
          // Read voted mapping (not directly accessible, so try/catch)
          let voted = false;
          try {
            voted = await votingContract.proposals(i).then(p => p.voted(walletAddress));
          } catch {}
          arr.push({ voted });
        }
        setVotingStatus(arr);
      } catch (err) {
        // fallback: mark all as not voted
        setVotingStatus(Array(proposals.length).fill({ voted: false }));
      }
    };
    fetchVotingStatus();
  }, [votingContract, proposals, walletAddress]);

  // Proposal creation handler
  const handleCreateProposal = async ({ description, duration }) => {
    if (!votingContract) return;
    setVotingLoading(true);
    try {
      const tx = await votingContract.createProposal(description, duration);
      await tx.wait();
      // Refresh proposals
      const count = await votingContract.getProposalCount();
      const p = await votingContract.getProposal(count - 1);
      setProposals([...proposals, {
        description: p[0],
        yesVotes: Number(p[1]),
        noVotes: Number(p[2]),
        endTime: Number(p[3]),
        passed: p[4],
        executed: p[4] !== undefined,
      }]);
    } catch (err) {
      alert('Proposal creation failed: ' + (err.reason || err.message));
    } finally {
      setVotingLoading(false);
    }
  };

  // Voting handler
  const handleVote = async (id, inFavor) => {
    if (!votingContract) return;
    setVotingLoading(true);
    try {
      const tx = await votingContract.vote(id, inFavor);
      await tx.wait();
      // Refresh proposals and voting status
      const count = await votingContract.getProposalCount();
      const arr = [];
      for (let i = 0; i < count; i++) {
        const p = await votingContract.getProposal(i);
        arr.push({
          description: p[0],
          yesVotes: Number(p[1]),
          noVotes: Number(p[2]),
          endTime: Number(p[3]),
          passed: p[4],
          executed: p[4] !== undefined,
        });
      }
      setProposals(arr);
    } catch (err) {
      alert('Voting failed: ' + (err.reason || err.message));
    } finally {
      setVotingLoading(false);
    }
  };

  // Finalize proposal
  const handleFinalize = async (id) => {
    if (!votingContract) return;
    setVotingLoading(true);
    try {
      const tx = await votingContract.finalize(id);
      await tx.wait();
      // Refresh proposals
      const count = await votingContract.getProposalCount();
      const arr = [];
      for (let i = 0; i < count; i++) {
        const p = await votingContract.getProposal(i);
        arr.push({
          description: p[0],
          yesVotes: Number(p[1]),
          noVotes: Number(p[2]),
          endTime: Number(p[3]),
          passed: p[4],
          executed: p[4] !== undefined,
        });
      }
      setProposals(arr);
    } catch (err) {
      alert('Finalize failed: ' + (err.reason || err.message));
    } finally {
      setVotingLoading(false);
    }
  };

  // Always check escrow status on page load and when escrowAddress changes
  useEffect(() => {
    const checkEscrowStatus = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(escrowAddress, escrowAbi, provider);
        const isFunded = await contract.isFunded();
        setEscrowStatus({ isFunded });
      } catch (err) {
        // Optionally handle error
      }
    };
    checkEscrowStatus();
  }, [escrowAddress]);

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50/50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white relative">
       <Navbar />
      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <FaWallet className="w-12 h-12 text-teal-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect MetaMask</h2>
            <p className="text-gray-600 mb-4 text-center">To join the community chat and participate, please connect your MetaMask wallet.</p>
            {authError && <div className="text-red-500 mb-2 text-sm">{authError}</div>}
            <button
              onClick={handleMetaMaskAuth}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 px-8 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-3 mb-2"
              disabled={authLoading}
            >
              {authLoading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
            <button
              onClick={() => setShowConnectModal(false)}
              className="w-full mt-1 text-teal-700 hover:underline text-sm"
              disabled={authLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(13,148,136,0.2)_25%,rgba(13,148,136,0.2)_26%,transparent_27%,transparent_74%,rgba(13,148,136,0.2)_75%,rgba(13,148,136,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(13,148,136,0.2)_25%,rgba(13,148,136,0.2)_26%,transparent_27%,transparent_74%,rgba(13,148,136,0.2)_75%,rgba(13,148,136,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={community.imageSrc}
                  alt={community.title}
                  className="w-20 h-20 rounded-2xl border-2 border-teal-100 shadow-lg"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-teal-700 mb-2">
                  {community.title}
                </h1>
                <div className="flex items-center gap-2 text-teal-600">
                  <FaShieldAlt className="w-4 h-4" />
                  <span className="text-sm">Verified Community</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleWalletButton}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isConnected
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-teal-700 hover:bg-teal-800 text-white"
              }`}
            >
              <FaWallet className="w-5 h-5" />
              {isConnected && walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} (Connected)`
                : "Connect Wallet"}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-teal-100 shadow-lg">
              <div className="flex items-center gap-3">
                <FaUsers className="text-teal-700 w-5 h-5" />
                <div>
                  <p className="text-gray-600 text-sm">Members</p>
                  <p className="text-teal-700 font-bold text-lg">
                    {community.peopleJoined} / {maxMembers || '∞'}
                  </p>
                </div>
              </div>
              {/* Real-time member list */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 font-semibold mb-1">Joined Members:</p>
                {members.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No members yet</p>
                ) : (
                  <ul className="text-xs text-gray-700 space-y-1 max-h-24 overflow-y-auto">
                    {members.map((addr, idx) => (
                      <li key={addr} className="truncate">{addr}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-teal-100 shadow-lg">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-teal-700 w-5 h-5" />
                <div>
                  <p className="text-gray-600 text-sm">Travel Date</p>
                  <p className="text-teal-700 font-bold text-lg">
                    {community.travelDates}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-teal-100 shadow-lg">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-teal-700 w-5 h-5" />
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-teal-700 font-bold text-lg">
                    {community.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-teal-100 shadow-lg">
              <div className="flex items-center gap-3">
                <FaEthereum className="text-teal-700 w-5 h-5" />
                <div>
                  <p className="text-gray-600 text-sm">Cost</p>
                  <p className="text-teal-700 font-bold text-lg">
                    {community.costEstimated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Community Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-teal-100 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-teal-700 mb-4">
                About This Community
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {community.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-teal-600">
                  <FaCube className="w-4 h-4" />
                  <span className="text-sm">Smart Contract Secured</span>
                </div>
                <div className="flex items-center gap-3 text-teal-600">
                  <FaShieldAlt className="w-4 h-4" />
                  <span className="text-sm">Decentralized Governance</span>
                </div>
              </div>

              {!isMember && (
                <button
                  onClick={handleJoinCommunity}
                  className={`w-full bg-teal-700 hover:bg-teal-800 text-white py-4 px-8 rounded-xl transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-3 ${members.length >= maxMembers || isMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={members.length >= maxMembers || isMember}
                >
                  <FaEthereum className="w-5 h-5" />
                  {isMember ? 'You are a member' : 'Join & Pay with ETH'}
                </button>
              )}
              {isMember && (
                <div className="w-full bg-green-100 text-green-700 py-4 px-8 rounded-xl text-center font-medium flex items-center justify-center gap-3">
                  <FaEthereum className="w-5 h-5" />
                  You are a member
                </div>
              )}
            </div>

            {/* Payment and Swap Buttons - only show when community is full and user is member */}
            {/* Remove Pay Full Amount button and show voting UI as soon as community is full and user is a member */}
            {/* {(members.length >= maxMembers) && isMember && (
              <div className="w-full mt-4">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Trip Proposals & Voting</h2>
                <ProposalForm onSubmit={handleCreateProposal} disabled={votingLoading} />
                <ProposalList
                  proposals={proposals}
                  onVote={handleVote}
                  onFinalize={handleFinalize}
                  currentUser={walletAddress}
                  votingStatus={votingStatus}
                />
              </div>
            )} */}

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-teal-100 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {memberProfiles.length > 0 && (
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>
                      {memberProfiles[memberProfiles.length - 1].name} joined {
                        (() => {
                          const joinTime = community && community.memberJoinTimestamps && community.memberJoinTimestamps[memberProfiles[memberProfiles.length - 1].address];
                          if (joinTime) {
                            const diff = Math.floor((Date.now() - joinTime) / 60000);
                            return diff === 0 ? 'just now' : `${diff} minute${diff > 1 ? 's' : ''} ago`;
                          }
                          return '';
                        })()
                      }
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Travel plan updated</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Payment milestone reached</span>
                </div>
              </div>
            </div>
            {/* Community Members List */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-teal-100 shadow-lg mt-6">
              <h3 className="text-lg font-bold text-teal-700 mb-4">Community Members</h3>
              {memberProfiles.length === 0 ? (
                <p className="text-gray-400 italic">No members yet</p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {memberProfiles.map((profile) => (
                    <li key={profile.address} className="flex items-center gap-2">
                      <span className="font-semibold text-teal-700">{profile.name}</span>
                      <span className="text-xs text-gray-500">({profile.address.slice(0, 6)}...{profile.address.slice(-4)})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Chat Section */}
          {/* In the chat section, always render the chat UI, but only allow sending if walletAddress is set */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-teal-100 shadow-lg h-full flex flex-col" style={{ minHeight: '500px' }}>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 border-b border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-teal-700">Community Chat</h2>
                </div>
                <div className="flex items-center gap-2 text-teal-600 text-sm">
                  <FaUsers className="w-4 h-4" />
                  <span>{community.peopleJoined} online</span>
                </div>
              </div>
              {/* Messages Container */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <FaCube className="w-8 h-8 mx-auto mb-4 opacity-50" />
                    <p>Start the conversation!</p>
                    <p className="text-sm mt-2">Be the first to send a message in this community.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSender = msg.sender === walletAddress;
                    const senderProfile = memberProfiles.find(p => p.address === msg.sender);
                    return (
                      <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl p-4 shadow-lg max-w-[80%] ${isSender ? 'bg-teal-100/80 text-gray-700' : 'bg-white border border-teal-100 text-gray-700'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-teal-600">{isSender ? 'You' : (senderProfile ? senderProfile.name : msg.sender)}</span>
                            <span className="text-xs text-gray-500">{msg.timestamp?.toLocaleTimeString?.() || ''}</span>
                          </div>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Input Area */}
              <div className="p-6 border-t border-teal-100">
                {/* Info line for non-members */}
                {!isMember && (
                  <div className="text-xs text-teal-700 mb-2 font-semibold">
                    You can chat after paying a very small amount (0.0001 BNB). The rest can be paid later after the decision.
                  </div>
                )}
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => walletAddress && isMember && e.key === "Enter" && sendMessage()}
                    placeholder={walletAddress ? (isMember ? "Type your message..." : "Pay to chat") : "Log in to chat"}
                    className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-gray-700 placeholder-gray-400"
                    disabled={!walletAddress || !isMember}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-all duration-300 font-medium"
                    disabled={!walletAddress || !isMember}
                  >
                    Send
                  </button>
                </div>
                {!walletAddress && (
                  <div className="text-xs text-red-500 mt-2">Please log in to send messages.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* In the UI, show the sweet popup modal for escrow payment */}
      {showEscrowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center animate-fadeIn">
            <button onClick={() => setShowEscrowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-teal-700 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold text-teal-700 mb-4">Escrow Payment</h2>
            {/* Remove ethAmount input for joining fee */}
            {escrowError && <div className="text-red-500 mb-2">{escrowError}</div>}
            <button
              onClick={handleEscrowPay}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 px-8 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-3 mb-2"
              disabled={escrowLoading || hasPaidJoin}
            >
              {escrowLoading ? 'Processing...' : 'Pay & Join (0.0001 ETH)'}
            </button>
            {hasPaidJoin && (
              <div className="text-green-600 font-semibold mt-2">You have already funded this trip. No further payment is required.</div>
            )}
          </div>
        </div>
      )}
      {/* Trip Proposals & Voting section at the bottom - side by side layout */}
      {(members.length >= maxMembers) && isMember && (
        <div className="container mx-auto px-4 py-12 mt-12">
          <div className="bg-gradient-to-br from-teal-50 via-white to-teal-100 border-4 border-teal-200/60 rounded-3xl shadow-2xl shadow-teal-100/40 p-10 flex flex-col items-center relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-teal-100 rounded-full opacity-30 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
            <h2 className="text-3xl font-extrabold text-teal-700 mb-2 text-center drop-shadow-lg">Trip Proposals & Voting</h2>
            <p className="text-lg text-teal-800 mb-8 text-center max-w-2xl">Participate in shaping your trip! Submit new proposals or vote on existing ones to help decide important details for your community adventure.</p>
            <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 items-stretch justify-center min-h-[420px] md:min-h-[480px]">
              <div className="flex-1 w-full md:max-w-md bg-white/90 border border-teal-100 rounded-2xl shadow-lg flex flex-col justify-center p-6" style={{ minHeight: '420px', height: '100%' }}>
                {/* Render ProposalForm directly, let the parent card provide the background and padding */}
                <ProposalForm onSubmit={handleCreateProposal} disabled={votingLoading} noCard />
              </div>
              <div className="hidden md:block h-full w-0.5 bg-teal-100 rounded-full mx-2"></div>
              <div className="flex-1 w-full bg-white/90 border border-teal-100 rounded-2xl shadow-lg flex flex-col p-4" style={{ minHeight: '420px', height: '100%' }}>
                <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                  <ProposalList
                    proposals={proposals}
                    onVote={handleVote}
                    onFinalize={handleFinalize}
                    currentUser={walletAddress}
                    votingStatus={votingStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;
