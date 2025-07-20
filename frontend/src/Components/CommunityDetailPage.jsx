import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot, updateDoc, runTransaction, collection, addDoc, query, orderBy, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  FaEthereum,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaShieldAlt,
  FaCube,
  FaExclamationTriangle,
} from "react-icons/fa";
import Navbar from "./Navbar";
import metamaskAuth from '../utils/metamaskAuth';
import { useState as useModalState } from 'react';
import EscrowTripPage from "./EscrowTripPage";
import { ethers } from "ethers";
import ProposalForm from './ProposalForm';
import ProposalList from './ProposalList';
import tripVotingArtifact from '../abis/TripVoting.json';
import escrowArtifact from '../abis/Escrow.json';
import { checkNetworkConnection, switchToBscTestnet } from '../utils/rpcUtils';
import { explainNodeSyncIssue } from '../utils/nodeSyncHelper';

const CommunityDetailPage = () => {
  // All hooks must be inside the component function

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
  const [finalizedResults, setFinalizedResults] = useState([]);
  const [votingContractReady, setVotingContractReady] = useState(false);
  const [canCreateProposals, setCanCreateProposals] = useState(false);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [nodeSyncIssues, setNodeSyncIssues] = useState(false);

  const escrowAddress = community?.escrowAddress;
  const escrowAbi = [
    "function isFunded() public view returns (bool)",
    "function deposit() payable",
  ];

  // Helper for case-insensitive address lookup
  const getPaidAmount = (obj, addr) => {
    if (!addr) return 0;
    const key = Object.keys(obj).find(k => k.toLowerCase() === addr.toLowerCase());
    return key ? parseFloat(obj[key]) : 0;
  };

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

  // Fetch finalized results from Firestore
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "communities", id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setFinalizedResults(docSnap.data().finalizedResults || []);
      }
    });
    return () => unsub();
  }, [id]);

  // Only allow proposal creation and voting for Firestore community members
  // Remove all contract membership checks, selfJoin/addMember logic, and related UI
  // No separate button for membership check

  // In the UI and logic, use only Firestore's `isMember` and payment status to gate proposal creation and voting
  useEffect(() => {
    async function setupVotingContract() {
      if (
        isMember &&
        getPaidAmount(joinPaidMembers, walletAddress) > 0 &&
        window.ethereum
      ) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          let accounts = await provider.listAccounts();
          // If no accounts, request them
          if (!accounts || accounts.length === 0) {
            try {
              accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (e) {
              setCanCreateProposals(false);
              setVotingContractReady(false);
              setVotingContract(null);
              setVotingAddress("");
              return;
            }
          }
          // Set walletAddress if not already set
          if (!walletAddress && accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
          if (accounts && accounts.length > 0) {
            setCanCreateProposals(true);
            setVotingContractReady(true);
            const signer = provider.getSigner();
            const votingAddr = "0x93390878FbD144848D8ef5f5bC1dD5BCa287AEA8";
            
            // Test the contract connection before setting it
            try {
              const contract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
              
              // Try to test the contract with a simple call, but handle "missing trie node" gracefully
              try {
                await contract.getProposalCount();
                setVotingContract(contract);
                setVotingAddress(votingAddr);
                console.log('✅ Voting contract initialized successfully');
              } catch (contractTestError) {
                // If we get "missing trie node" error, still set the contract but warn the user
                if (contractTestError.message.includes('missing trie node') || 
                    contractTestError.message.includes('Internal JSON-RPC error')) {
                  console.warn('⚠️ Contract test failed due to node sync issues, but setting contract anyway');
                  setVotingContract(contract);
                  setVotingAddress(votingAddr);
                  setNodeSyncIssues(true); // Set the flag to show notification
                  console.log('✅ Voting contract initialized (with node sync warning)');
                } else {
                  throw contractTestError;
                }
              }
            } catch (contractError) {
              console.error('❌ Failed to initialize voting contract:', contractError);
              setCanCreateProposals(false);
              setVotingContractReady(false);
              setVotingContract(null);
              setVotingAddress("");
            }
          } else {
            setCanCreateProposals(false);
            setVotingContractReady(false);
            setVotingContract(null);
            setVotingAddress("");
          }
        } catch (error) {
          console.error('Error setting up voting contract:', error);
          setCanCreateProposals(false);
          setVotingContractReady(false);
          setVotingContract(null);
          setVotingAddress("");
        }
      } else {
        setCanCreateProposals(false);
        setVotingContractReady(false);
        setVotingContract(null);
        setVotingAddress("");
      }
    }
    setupVotingContract();
    // eslint-disable-next-line
  }, [isMember, joinPaidMembers, walletAddress]);

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
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );
      
      const authPromise = metamaskAuth.authenticate();
      const result = await Promise.race([authPromise, timeoutPromise]);
      
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
    } catch (error) {
      console.error('MetaMask connection error:', error);
      if (error.message.includes('timeout')) {
        setAuthError('Connection timed out. Please try again or check your MetaMask connection.');
      } else if (error.code === 4001) {
        setAuthError('You rejected the connection request in MetaMask.');
      } else {
        setAuthError('MetaMask connection failed: ' + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!walletAddress || isMember || members.length >= maxMembers) return;
    setShowEscrowModal(true);
  };

  // In handleEscrowPay, use the correct ABI and define provider/signer
  const handleEscrowPay = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to proceed.');
      return;
    }

    // Add cache-busting timestamp
    console.log('🔄 Escrow payment initiated at:', new Date().toISOString());

    setEscrowLoading(true);
    setEscrowError('');

    try {
      // Check network connection first
      const networkStatus = await checkNetworkConnection();
      console.log('Network status:', networkStatus);
      
      if (!networkStatus.connected) {
        throw new Error('MetaMask not connected. Please connect your wallet.');
      }
      
      if (!networkStatus.isBscTestnet) {
        console.log('Not on BSC Testnet, attempting to switch...');
        try {
          await switchToBscTestnet();
          console.log('✅ Switched to BSC Testnet');
        } catch (switchError) {
          throw new Error('Please switch to BSC Testnet in MetaMask and try again.');
        }
      }
      
      if (!networkStatus.hasAccount) {
        throw new Error('No MetaMask account connected. Please connect your account.');
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get escrow address from community data
      let escrowAddr = community?.escrowAddress;
      
      if (!escrowAddr) {
        throw new Error('This community does not have an escrow contract. Please contact the community creator.');
      }
      
      console.log('Using escrow contract address from community:', escrowAddr);
      
      // Create contract instance with proper error handling
      let escrowContract;
      try {
        console.log('Creating escrow contract with address:', escrowAddr);
        console.log('ABI functions available:', escrowArtifact.abi.map(item => item.name || item.type).filter(Boolean));
        
        escrowContract = new ethers.Contract(escrowAddr, escrowArtifact.abi, signer);
        
        // Test the contract connection
        console.log('Testing contract connection...');
        const balance = await escrowContract.getBalance();
        console.log('Contract balance:', balance.toString());
        
        // Verify the deposit function exists
        if (!escrowContract.deposit) {
          throw new Error('Deposit function not found in contract ABI');
        }
        
        console.log('✅ Contract initialized successfully at:', escrowAddr);
      } catch (contractError) {
        console.error('Contract initialization error:', contractError);
        throw new Error(`Failed to connect to escrow contract at ${escrowAddr}. Please ensure the contract is deployed on the current network.`);
      }

      // Pay the joining fee - using ethers v5 syntax
      const joinFee = ethers.utils.parseEther("0.0001");
      console.log('Attempting to call deposit function with fee:', joinFee.toString());
      
      // Use ethers v5 syntax for contract calls
      const tx = await escrowContract.deposit({ value: joinFee });
      await tx.wait();

      console.log('✅ Join fee paid successfully');

      // Update payment status in Firestore
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) throw new Error("Community not found");
        const data = communityDoc.data();
        const joinPaidMembers = data.joinPaidMembers || {};
        
        // Update the user's payment status
        joinPaidMembers[walletAddress] = 0.0001;
        
        transaction.update(communityRef, {
          joinPaidMembers: joinPaidMembers
        });
      });

      // Add user to Firestore community
      await addUserToCommunity();

      // Try to add user as member on-chain automatically
      try {
        console.log('🔄 Attempting to add user as member on-chain...');
        
        // First try selfJoin
        const votingAddr = "0xe672AA0b915e3b03360aA4249eDA621F43a6a027";
        const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
        
        try {
          const selfJoinTx = await votingContract.selfJoin();
          await selfJoinTx.wait();
          console.log('✅ Successfully joined on-chain via selfJoin');
        } catch (selfJoinError) {
          console.log('selfJoin failed, trying addMember via backend...');
          
          // Try backend addMember
          try {
            console.log('Calling /addMemberOnChain for', walletAddress);
            const response = await fetch('http://localhost:5000/addMemberOnChain', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ memberAddress: walletAddress }),
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                console.log('✅ Successfully added member on-chain via backend');
              }
            } else {
              console.log('Backend addMember failed, but user is still added to Firestore');
            }
          } catch (backendError) {
            console.log('Backend addMember failed:', backendError);
          }
        }
        
      } catch (error) {
        console.log('User is not yet a member on-chain, but added to Firestore');
      }

      setShowEscrowModal(false);
      alert('✅ Successfully joined the community! You can now participate in proposals and voting.');

    } catch (error) {
      console.error('Escrow payment error:', error);
      
      // More detailed error handling
      if (error.code === 4001) {
        setEscrowError('You rejected the transaction in MetaMask.');
      } else if (error.message.includes('payJoinFee')) {
        setEscrowError('Contract function error: The deposit function is not available. Please check your network connection.');
      } else if (error.message.includes('Internal JSON-RPC error')) {
        setEscrowError('Network error: Please check your MetaMask connection and try again.');
      } else if (error.message.includes('missing trie node')) {
        setEscrowError('Network sync issue: Please wait a moment and try again.');
      } else if (error.message.includes('Failed to connect to escrow contract')) {
        setEscrowError('Contract connection failed. Please ensure you are connected to BSC Testnet and try again.');
      } else if (error.message.includes('This community does not have an escrow contract')) {
        setEscrowError('This community was created without escrow functionality. Please contact the community creator to add escrow support.');
      } else if (error.message.includes('No escrow contract could be initialized')) {
        setEscrowError('No escrow contract found. The system will attempt to deploy a new one. Please try again.');
      } else if (error.message.includes('execution reverted')) {
        setEscrowError('Transaction failed: The contract rejected the transaction. This might be due to insufficient funds or network issues.');
      } else {
        setEscrowError('Payment failed: ' + error.message);
      }
    } finally {
      setEscrowLoading(false);
    }
  };

  // Add function to automatically add user as member when they join
  const addUserToCommunity = async () => {
    if (!window.ethereum || !walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      // Add user to Firestore community
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) throw new Error("Community not found");
        const data = communityDoc.data();
        const currentMembers = data.members || [];
        const memberJoinTimestamps = data.memberJoinTimestamps || {};
        const joinPaidMembers = data.joinPaidMembers || {};
        
        if (currentMembers.includes(walletAddress)) throw new Error("Already a member");
        if (currentMembers.length >= data.maxMembers) throw new Error("Community is full");
        
        transaction.update(communityRef, {
          members: [...currentMembers, walletAddress],
          peopleCount: currentMembers.length + 1,
          memberJoinTimestamps: { ...memberJoinTimestamps, [walletAddress]: Date.now() },
        });
      });

      // Try to add user as member on-chain automatically
      try {
        console.log('🔄 Attempting to add user as member on-chain...');
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const votingAddr = "0x043F3fc3499275C419F5E0dDbbD3Aed34F26D3b7";
        const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
        
        try {
          const selfJoinTx = await votingContract.selfJoin();
          await selfJoinTx.wait();
          console.log('✅ Successfully joined on-chain via selfJoin');
        } catch (selfJoinError) {
          console.log('selfJoin failed, but user is still added to Firestore');
        }
        
      } catch (error) {
        console.log('User is not yet a member on-chain, but added to Firestore');
      }

      setIsMember(true);
      console.log('✅ Successfully added user to community');
      
    } catch (error) {
      console.error('Error adding user to community:', error);
      alert('Error adding user to community: ' + error.message);
    }
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
  const hasPaidJoin = getPaidAmount(joinPaidMembers, walletAddress) > 0;
  const allPaidJoin = Object.keys(joinPaidMembers).length === maxMembers && Object.values(joinPaidMembers).every(a => parseFloat(a) > 0);

  const joinPaid = getPaidAmount(joinPaidMembers, walletAddress);
  const fullPaid = getPaidAmount(fullPaidMembers, walletAddress);
  const estimatedCost = parseFloat(community?.costEstimated || 0);
  const remaining = Math.max(estimatedCost - joinPaid, 0).toFixed(4);
  const hasPaidFull = fullPaid >= estimatedCost;
  const allPaidFull = Object.keys(fullPaidMembers).length === maxMembers && Object.values(fullPaidMembers).every(a => parseFloat(a) >= estimatedCost);



  // Fetch proposals from contract
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const communityRef = doc(db, "communities", id);
        const communityDoc = await getDoc(communityRef);
        
        if (communityDoc.exists()) {
          const data = communityDoc.data();
          const proposals = data.proposals || [];
          
          // Filter proposals for this community and format them
          const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            description: proposal.description,
            options: proposal.options,
            optionsVotes: proposal.votes,
            endTime: proposal.endTime,
            executed: proposal.executed,
            winningOption: proposal.winningOption,
            createdBy: proposal.createdBy,
            votedBy: proposal.votedBy || []
          }));
          
          setProposals(formattedProposals);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    fetchProposals();
  }, [id]);

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

  // Add function to ensure on-chain membership
  const ensureOnChainMembership = async () => {
    if (!window.ethereum || !walletAddress) {
      alert('Please connect your wallet first.');
      return false;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingAddr = "0xe672AA0b915e3b03360aA4249eDA621F43a6a027";
      const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
      
      // Check if already a member on-chain
      try {
        const isOnChainMember = await votingContract.isMember(walletAddress);
        if (isOnChainMember) {
          console.log('✅ Already a member on-chain');
          return true;
        }
      } catch (error) {
        console.log('Could not check on-chain membership due to node issues, proceeding with join...');
      }
      
      // Only try to join if not already a member
      try {
        console.log('🔄 Attempting to join on-chain via selfJoin...');
        const tx = await votingContract.selfJoin();
        await tx.wait();
        console.log('✅ Successfully joined on-chain via selfJoin');
        return true;
      } catch (selfJoinError) {
        console.error('selfJoin failed:', selfJoinError);
        
        // Check if the error is because already a member
        if (selfJoinError.message.includes('Already a member') || 
            selfJoinError.message.includes('execution reverted') ||
            selfJoinError.reason === 'Already a member') {
          console.log('✅ User is already a member on-chain (selfJoin reverted)');
          return true; // Consider this a success since they're already a member
        }
        
        // If it's a different error, show helpful message
        if (selfJoinError.message.includes('Not a member')) {
          alert('⚠️ Self-join failed. You may need to be added by the contract owner or try a different approach.');
        } else {
          alert('⚠️ Failed to join on-chain. This might be due to:\n' +
                '1. Network issues\n' +
                '2. Contract permissions\n' +
                '3. Gas estimation problems\n\n' +
                'Please try again or contact support.');
        }
        return false;
      }
    } catch (error) {
      console.error('Error ensuring on-chain membership:', error);
      alert('Error ensuring membership: ' + error.message);
      return false;
    }
  };

  // --- Replace handleCreateProposal with Firestore-based community-specific logic ---
  const handleCreateProposal = async ({ description, duration, options }) => {
    if (!isFirestoreMember) {
      alert("You must be a community member to create proposals or vote.");
      return;
    }
    setVotingLoading(true);
    try {
      if (!votingContract) {
        throw new Error('Voting contract not ready or wallet not connected');
      }
      
      console.log('Creating proposal with:', { description, options, duration });
      
      // Generate unique proposal ID using community ID and timestamp
      const proposalId = `${id}-${Date.now()}`;
      console.log('📝 Generated proposal ID:', proposalId);
      
      // Store proposal in Firestore first
      const proposalData = {
        id: proposalId,
        communityId: id,
        description,
        options,
        duration,
        createdAt: Date.now(),
        endTime: Date.now() + (duration * 60 * 1000), // Convert minutes to milliseconds
        createdBy: walletAddress,
        votes: options.map(() => 0),
        votedBy: [],
        executed: false,
        winningOption: null
      };
      
      // Add to Firestore
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) throw new Error("Community not found");
        const data = communityDoc.data();
        const proposals = data.proposals || [];
        
        transaction.update(communityRef, {
          proposals: [...proposals, proposalData]
        });
      });
      
      // ALWAYS try to create on-chain proposal - this will trigger MetaMask
      try {
        console.log('🔄 Creating on-chain proposal with:', { proposalId, description, options, duration });
        const tx = await votingContract.createProposal(proposalId, description, options, duration);
        console.log('✅ On-chain proposal transaction sent, waiting for confirmation...');
        await tx.wait();
        console.log('✅ On-chain proposal created successfully');
      } catch (onChainError) {
        console.warn('⚠️ On-chain proposal creation failed, but Firestore proposal was created:', onChainError);
        // Don't throw error, just warn - Firestore proposal was already created
      }
      
      // Refresh proposals from Firestore
      try {
        const refreshCommunityRef = doc(db, "communities", id);
        const communityDoc = await getDoc(refreshCommunityRef);
        
        if (communityDoc.exists()) {
          const data = communityDoc.data();
          const proposals = data.proposals || [];
          
          // Filter proposals for this community and format them
          const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            description: proposal.description,
            options: proposal.options,
            optionsVotes: proposal.votes,
            endTime: proposal.endTime,
            executed: proposal.executed,
            winningOption: proposal.winningOption,
            createdBy: proposal.createdBy,
            votedBy: proposal.votedBy || []
          }));
          
          setProposals(formattedProposals);
        }
      } catch (error) {
        console.error('Error refreshing proposals:', error);
      }
      
      alert('Proposal created successfully!');
    } catch (err) {
      console.error('Proposal creation error:', err);
      if (err.code === 4001) {
        alert('You rejected the transaction in MetaMask. Please confirm to create a proposal.');
      } else if (err.message.includes('missing trie node')) {
        alert('Blockchain node is out of sync. Please try again in a few minutes or use the "Troubleshoot Network" button.');
      } else if (err.error && err.error.message) {
        alert('Proposal creation failed: ' + err.error.message);
      } else {
        alert('Proposal creation failed: ' + (err.reason || err.message));
      }
    } finally {
      setVotingLoading(false);
    }
  };

  // --- Replace handleVote with Firestore-based logic ---
  const handleVote = async (proposalId, optionIdx) => {
    setVotingLoading(true);
    try {
      if (!isFirestoreMember) {
        alert("You must be a community member to vote.");
        return;
      }
      
      console.log('🔄 Attempting to vote for proposal:', proposalId, 'option:', optionIdx);
      
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) throw new Error("Community not found");
        const data = communityDoc.data();
        const proposals = data.proposals || [];
        
        console.log('📋 Available proposals:', proposals.map(p => p.id));
        console.log('🔍 Looking for proposal ID:', proposalId);
        
        // Find the proposal
        const proposalIndex = proposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) {
          console.error('❌ Proposal not found. Available proposals:', proposals.map(p => p.id));
          throw new Error(`Proposal not found: ${proposalId}`);
        }
        
        const proposal = proposals[proposalIndex];
        
        // Check if voting has ended
        if (Date.now() > proposal.endTime) {
          throw new Error("Voting has ended");
        }
        
        // Check if user has already voted
        if (proposal.votedBy && proposal.votedBy.includes(walletAddress)) {
          throw new Error("You have already voted on this proposal");
        }
        
        // Update the proposal
        const updatedProposals = [...proposals];
        updatedProposals[proposalIndex] = {
          ...proposal,
          votes: proposal.votes.map((vote, idx) => idx === optionIdx ? vote + 1 : vote),
          votedBy: [...(proposal.votedBy || []), walletAddress]
        };
        
        transaction.update(communityRef, {
          proposals: updatedProposals
        });
      });
      
      // Refresh proposals from Firestore
      try {
        const voteRefreshCommunityRef = doc(db, "communities", id);
        const communityDoc = await getDoc(voteRefreshCommunityRef);
        
        if (communityDoc.exists()) {
          const data = communityDoc.data();
          const proposals = data.proposals || [];
          
          // Filter proposals for this community and format them
          const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            description: proposal.description,
            options: proposal.options,
            optionsVotes: proposal.votes,
            endTime: proposal.endTime,
            executed: proposal.executed,
            winningOption: proposal.winningOption,
            createdBy: proposal.createdBy,
            votedBy: proposal.votedBy || []
          }));
          
          setProposals(formattedProposals);
        }
      } catch (error) {
        console.error('Error refreshing proposals:', error);
      }
      
      // Try to vote on-chain as well
      try {
        if (votingContract) {
          console.log('🔄 Voting on-chain for proposal:', proposalId, 'option:', optionIdx);
          const tx = await votingContract.vote(proposalId, optionIdx);
          console.log('✅ On-chain vote transaction sent, waiting for confirmation...');
          await tx.wait();
          console.log('✅ On-chain vote recorded successfully');
        }
      } catch (onChainError) {
        console.warn('⚠️ On-chain voting failed, but Firestore vote was recorded:', onChainError);
      }
      
      setVotingStatus(prev => ({ ...prev, [proposalId]: { voted: true } }));
      
      alert('Vote recorded successfully!');
    } catch (err) {
      alert('Voting failed: ' + err.message);
    } finally {
      setVotingLoading(false);
    }
  };

  // Finalize proposal with Firestore
  const handleFinalize = async (proposalId) => {
    setVotingLoading(true);
    try {
      const communityRef = doc(db, "communities", id);
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) throw new Error("Community not found");
        const data = communityDoc.data();
        const proposals = data.proposals || [];
        
        // Find the proposal
        const proposalIndex = proposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) throw new Error("Proposal not found");
        
        const proposal = proposals[proposalIndex];
        
        // Check if voting has ended
        if (Date.now() < proposal.endTime) {
          throw new Error("Voting is still active");
        }
        
        if (proposal.executed) {
          throw new Error("Proposal has already been finalized");
        }
        
        // Find winning option
        let maxVotes = 0;
        let winner = 0;
        for (let i = 0; i < proposal.votes.length; i++) {
          if (proposal.votes[i] > maxVotes) {
            maxVotes = proposal.votes[i];
            winner = i;
          }
        }
        
        // Update the proposal
        const updatedProposals = [...proposals];
        updatedProposals[proposalIndex] = {
          ...proposal,
          executed: true,
          winningOption: winner
        };
        
        transaction.update(communityRef, {
          proposals: updatedProposals
        });
      });
      
      // Refresh proposals from Firestore
      try {
        const finalizeRefreshCommunityRef = doc(db, "communities", id);
        const communityDoc = await getDoc(finalizeRefreshCommunityRef);
        
        if (communityDoc.exists()) {
          const data = communityDoc.data();
          const proposals = data.proposals || [];
          
          // Filter proposals for this community and format them
          const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            description: proposal.description,
            options: proposal.options,
            optionsVotes: proposal.votes,
            endTime: proposal.endTime,
            executed: proposal.executed,
            winningOption: proposal.winningOption,
            createdBy: proposal.createdBy,
            votedBy: proposal.votedBy || []
          }));
          
          setProposals(formattedProposals);
        }
      } catch (error) {
        console.error('Error refreshing proposals:', error);
      }
      
      // Try to finalize on-chain as well
      try {
        if (votingContract) {
          console.log('🔄 Finalizing proposal on-chain:', proposalId);
          const tx = await votingContract.finalize(proposalId);
          console.log('✅ On-chain finalization transaction sent, waiting for confirmation...');
          await tx.wait();
          console.log('✅ On-chain proposal finalized successfully');
        }
      } catch (onChainError) {
        console.warn('⚠️ On-chain finalization failed, but Firestore proposal was finalized:', onChainError);
      }
      
      alert('Proposal finalized successfully!');
    } catch (err) {
      alert('Finalize failed: ' + err.message);
    } finally {
      setVotingLoading(false);
    }
  };

  // Always check escrow status on page load and when escrowAddress changes
  useEffect(() => {
    const checkEscrowStatus = async () => {
      if (!window.ethereum || !escrowAddress) return;
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

  // Add network troubleshooting function
  const troubleshootNetwork = async () => {
    try {
      const networkStatus = await checkNetworkConnection();
      
      if (!networkStatus.connected) {
        alert('MetaMask is not connected. Please install MetaMask and try again.');
        return;
      }
      
      if (!networkStatus.isBscTestnet) {
        const switchResult = await switchToBscTestnet();
        if (switchResult) {
          alert('Successfully switched to BSC Testnet. Please try your action again.');
          window.location.reload();
        } else {
          alert('Failed to switch to BSC Testnet. Please manually switch to BSC Testnet in MetaMask.');
        }
        return;
      }
      
      if (!networkStatus.hasAccount) {
        alert('No account connected. Please connect your MetaMask account.');
        return;
      }
      
      alert(`Network Status:\n` +
        `Connected: ${networkStatus.connected}\n` +
        `Network: BSC Testnet\n` +
        `Account: ${networkStatus.account}\n` +
        `Chain ID: ${networkStatus.chainId}\n\n` +
        `If you're still experiencing issues, try:\n` +
        `1. Refreshing the page\n` +
        `2. Switching networks and back\n` +
        `3. Waiting a few minutes and trying again`);
        
    } catch (error) {
      console.error('Network troubleshooting error:', error);
      alert('Network troubleshooting failed: ' + error.message);
    }
  };

  // Add function to explain node sync issues
  const showNodeSyncExplanation = () => {
    const explanation = explainNodeSyncIssue();
    alert(`${explanation.title}\n\n${explanation.explanation}\n\nSolutions:\n${explanation.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
  };

  // Add function to check membership status
  const checkMembershipStatus = async () => {
    if (!window.ethereum || !walletAddress) {
      return { firestore: false, onChain: false };
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const votingAddr = "0xe672AA0b915e3b03360aA4249eDA621F43a6a027";
      const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, provider);
      
      const isOnChainMember = await votingContract.isMember(walletAddress);
      
      return {
        firestore: isFirestoreMember,
        onChain: isOnChainMember
      };
    } catch (error) {
      console.error('Error checking membership status:', error);
      return {
        firestore: isFirestoreMember,
        onChain: false,
        error: error.message
      };
    }
  };

  // Add function to manually add user as member on-chain
  const addUserAsMemberOnChain = async () => {
    if (!window.ethereum || !walletAddress) {
      alert('Please connect your wallet first.');
      return false;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingAddr = "0xe672AA0b915e3b03360aA4249eDA621F43a6a027";
      const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
      
      console.log('🔄 Attempting to add user as member on-chain...');
      
      // Try to add the user as a member (this requires contract owner permissions)
      const tx = await votingContract.addMember(walletAddress);
      await tx.wait();
      
      console.log('✅ Successfully added user as member on-chain');
      alert('✅ Successfully added as member on-chain! You can now create proposals.');
      return true;
      
    } catch (error) {
      console.error('Failed to add user as member:', error);
      
      if (error.message.includes('Only owner can add')) {
        alert('❌ Only the contract owner can add members. Please contact the contract owner to add you as a member.');
      } else if (error.message.includes('Already a member')) {
        alert('✅ You are already a member on-chain!');
        return true;
      } else {
        alert('❌ Failed to add as member: ' + error.message);
      }
      return false;
    }
  };

  // Add function to force membership (handles all edge cases)
  const forceMembership = async () => {
    if (!window.ethereum || !walletAddress) {
      alert('Please connect your wallet first.');
      return false;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingAddr = "0xe672AA0b915e3b03360aA4249eDA621F43a6a027";
      const votingContract = new ethers.Contract(votingAddr, tripVotingArtifact.abi, signer);
      
      console.log('🔄 Attempting to force membership...');
      
      // First check if already a member
      try {
        const isOnChainMember = await votingContract.isMember(walletAddress);
        if (isOnChainMember) {
          console.log('✅ Already a member on-chain');
          alert('✅ You are already a member on-chain!');
          return true;
        }
      } catch (error) {
        console.log('Could not check membership status, proceeding...');
      }
      
      // Try selfJoin with retry logic
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 Attempt ${attempt}: Trying selfJoin...`);
          const tx = await votingContract.selfJoin();
          await tx.wait();
          console.log('✅ Successfully joined on-chain via selfJoin');
          alert('✅ Successfully joined on-chain! You can now create proposals.');
          return true;
        } catch (error) {
          console.log(`Attempt ${attempt} failed:`, error.message);
          
          if (error.message.includes('Already a member')) {
            console.log('✅ User is already a member (selfJoin reverted)');
            alert('✅ You are already a member on-chain!');
            return true;
          }
          
          if (attempt === 3) {
            // Last attempt failed, try a different approach
            alert('⚠️ Self-join failed after 3 attempts. This might be due to:\n' +
                  '1. Network issues\n' +
                  '2. Contract permissions\n' +
                  '3. Gas estimation problems\n\n' +
                  'Please try the "Add Me as Member On-Chain" button or contact support.');
            return false;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
    } catch (error) {
      console.error('Error forcing membership:', error);
      alert('Error forcing membership: ' + error.message);
      return false;
    }
  };

  // Gate on-chain proposal creation and voting by Firestore membership
  const isFirestoreMember = members.map(m => m.toLowerCase()).includes(walletAddress?.toLowerCase());

  // Add escrow functionality to existing community
  const addEscrowToCommunity = async () => {
    if (!window.ethereum || !walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    // Check if user is the community creator (you can modify this logic)
    if (community?.createdBy && community.createdBy !== walletAddress) {
      alert('Only the community creator can add escrow functionality.');
      return;
    }

    try {
      console.log('🔄 Adding escrow functionality to community...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Import ABI and bytecode
      const escrowArtifact = await import('../abis/Escrow.json');
      const factory = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, signer);
      const userAddress = await signer.getAddress();
      
      console.log('Deploying escrow contract with payee address:', userAddress);
      const escrowContract = await factory.deploy(userAddress);
      await escrowContract.deployed();
      const escrowAddress = escrowContract.address;
      console.log('✅ Escrow contract deployed at:', escrowAddress);

      // Update Firestore with escrowAddress
      const communityRef = doc(db, "communities", id);
      await updateDoc(communityRef, { escrowAddress });
      console.log('✅ Community updated with escrow address:', escrowAddress);
      
      alert('✅ Escrow functionality added successfully! Users can now join with payments.');
      
    } catch (error) {
      console.error('Error adding escrow functionality:', error);
      alert('Failed to add escrow functionality: ' + error.message);
    }
  };

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
       
       {/* Node Sync Issues Notification */}
       {nodeSyncIssues && (
         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
           <div className="flex items-center gap-2">
             <FaExclamationTriangle className="w-5 h-5" />
             <div>
               <p className="font-semibold">Blockchain Node Sync Issues</p>
               <p className="text-sm">Some features may be limited. Try the "Troubleshoot Network" button below.</p>
             </div>
           </div>
         </div>
       )}
       
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
              
              {/* Debug button for membership issues */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={async () => {
                    const { firestore, onChain } = await checkMembershipStatus();
                    alert(`Membership Status:\nWallet: ${walletAddress}\nFirestore Member: ${firestore}\nOn-Chain Member: ${onChain}\nCan Create Proposals: ${canCreateProposals}\nVoting Contract Ready: ${votingContractReady}`);
                  }}
                  className="w-full mt-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Debug Membership Status
                </button>
              )}
              
              {/* Network troubleshooting button */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={troubleshootNetwork}
                  className="w-full mt-2 bg-orange-100 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FaExclamationTriangle className="w-4 h-4" />
                  Troubleshoot Network
                </button>
              )}
              
              {/* Node sync explanation button */}
              {(members.length >= maxMembers) && isMember && nodeSyncIssues && (
                <button
                  onClick={showNodeSyncExplanation}
                  className="w-full mt-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  What are Node Sync Issues?
                </button>
              )}
              
              {/* Ensure on-chain membership button */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={async () => {
                    setVotingLoading(true);
                    try {
                      const success = await ensureOnChainMembership();
                      if (success) {
                        alert('✅ Successfully ensured on-chain membership! You can now create proposals.');
                      } else {
                        alert('❌ Failed to ensure on-chain membership. Please try joining the community again.');
                      }
                    } catch (error) {
                      alert('Error ensuring membership: ' + error.message);
                    } finally {
                      setVotingLoading(false);
                    }
                  }}
                  className="w-full mt-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  disabled={votingLoading}
                >
                  {votingLoading ? 'Ensuring Membership...' : 'Ensure On-Chain Membership'}
                </button>
              )}
              
              {/* Force membership button */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={forceMembership}
                  className="w-full mt-2 bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  🔄 Force Membership (Retry Logic)
                </button>
              )}
              
              {/* Add escrow functionality button for community creators */}
              {!community?.escrowAddress && walletAddress && (
                <button
                  onClick={addEscrowToCommunity}
                  className="w-full mt-2 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  🔧 Add Escrow Functionality (Creator Only)
                </button>
              )}
              
              {/* Add user as member on-chain button */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={addUserAsMemberOnChain}
                  className="w-full mt-2 bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  🔧 Add Me as Member On-Chain (Owner Only)
                </button>
              )}
              
              {/* Direct proposal creation test button */}
              {(members.length >= maxMembers) && isMember && (
                <button
                  onClick={async () => {
                    try {
                      if (!votingContract) {
                        alert('Voting contract not ready');
                        return;
                      }
                      
                      // Try to create a test proposal directly
                      const testDescription = "Test Proposal - " + new Date().toLocaleString();
                      const testOptions = ["Option 1", "Option 2"];
                      const testDuration = 60; // 1 hour
                      
                      console.log('🔄 Attempting direct proposal creation...');
                      const tx = await votingContract.createProposal(testDescription, testOptions, testDuration);
                      await tx.wait();
                      alert('✅ Test proposal created successfully!');
                      
                      // Refresh proposals
                      const count = await votingContract.getProposalCount();
                      const arr = [];
                      for (let i = 0; i < count; i++) {
                        const p = await votingContract.getProposal(i);
                        arr.push({
                          description: p[0],
                          options: p[1],
                          optionsVotes: p[2].map(v => Number(v)),
                          endTime: Number(p[3]),
                          executed: p[4],
                          winningOption: Number(p[5]),
                        });
                      }
                      setProposals(arr);
                    } catch (error) {
                      console.error('Direct proposal creation failed:', error);
                      alert('❌ Direct proposal creation failed: ' + error.message);
                    }
                  }}
                  className="w-full mt-2 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  🧪 Try Direct Proposal Creation (Bypass All Checks)
                </button>
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
            {/* <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-teal-100 shadow-lg">
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
            </div> */}
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
          {isFirestoreMember ? (
            <div className="bg-gradient-to-br from-teal-50 via-white to-teal-100 border-4 border-teal-200/60 rounded-3xl shadow-2xl shadow-teal-100/40 p-10 flex flex-col items-center relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-teal-100 rounded-full opacity-30 blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
              <h2 className="text-3xl font-extrabold text-teal-700 mb-2 text-center drop-shadow-lg">Trip Proposals & Voting</h2>
              <p className="text-lg text-teal-800 mb-8 text-center max-w-2xl">Participate in shaping your trip! Submit new proposals or vote on existing ones to help decide important details for your community adventure.</p>
              
              {/* Status indicator */}
              {!canCreateProposals && (
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-center">
                  <p className="font-medium">Voting setup in progress...</p>
                  <p className="text-sm mt-1">Please wait while we verify your membership and payment status.</p>
                </div>
              )}
              
              {canCreateProposals && (
                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 text-center">
                  <p className="font-medium">✓ Ready to create proposals and vote!</p>
                  <p className="text-sm mt-1">
                    {votingContractReady && isMember ? 
                      "You are a verified member with full voting privileges." :
                      "You have paid the joining fee and can create proposals. The system will handle voting contract issues automatically."
                    }
                  </p>
                </div>
              )}
              
              <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 items-stretch justify-center min-h-[420px] md:min-h-[480px]">
                <div className="flex-1 w-full md:max-w-md bg-white/90 border border-teal-100 rounded-2xl shadow-lg flex flex-col justify-center p-6" style={{ minHeight: '420px', height: '100%' }}>
                  {/* Render ProposalForm directly, let the parent card provide the background and padding */}
                  <ProposalForm onSubmit={handleCreateProposal} disabled={votingLoading || !canCreateProposals} noCard />
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
          ) : (
            <div className="text-red-500 font-bold my-8 text-center">
              You must be a community member to create proposals or vote.
            </div>
          )}
        </div>
      )}
      {finalizedResults.length > 0 && (
        <div className="container mx-auto px-4 py-6 mt-4">
          <h3 className="text-2xl font-bold text-teal-700 mb-4">Finalized Proposal Results</h3>
          <div className="space-y-4">
            {finalizedResults.map((res, idx) => (
              <div key={idx} className="bg-white border border-teal-100 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="font-semibold text-teal-700">{res.description}</div>
                <div className="text-gray-700">Final Decision: <span className="font-bold text-green-700">{res.winningOption}</span> ({res.votes} votes)</div>
                <div className="text-xs text-gray-500">Options: {res.options.map((opt, i) => `${opt} (${res.optionsVotes[i]})`).join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;
