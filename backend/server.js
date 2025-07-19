const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { Network, Alchemy } = require("alchemy-sdk");
const { contractAddress, contractABI } = require('./constants'); // Ensure this file exists

const app = express();
const port = 5000; // Define port once

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ethereum provider setup - Use multiple reliable BSC Testnet endpoints
const BSC_TESTNET_RPC_URLS = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://bsc-testnet.public.blastapi.io',
  'https://bsc-testnet.publicnode.com'
];

let provider;
let currentRpcIndex = 0;

// Function to initialize provider with fallback
const initializeProvider = async () => {
  for (let i = 0; i < BSC_TESTNET_RPC_URLS.length; i++) {
    try {
      const testProvider = new ethers.JsonRpcProvider(BSC_TESTNET_RPC_URLS[i]);
      // Test the connection
      await testProvider.getBlockNumber();
      provider = testProvider;
      currentRpcIndex = i;
      console.log(`✅ Connected to BSC Testnet via: ${BSC_TESTNET_RPC_URLS[i]}`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to connect to: ${BSC_TESTNET_RPC_URLS[i]}`);
      continue;
    }
  }
  throw new Error('All BSC Testnet RPC endpoints failed');
};

// Initialize provider on startup
initializeProvider().catch(console.error);

// Smart contract instance
let contract;
const initializeContract = () => {
  if (provider) {
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    console.log(`✅ Contract initialized at: ${contractAddress}`);
  }
};

// Route to create a community on the blockchain
app.post('/createCommunity', async (req, res) => {
    const { communityName, country, location, peopleCount, travelDates, description, imageSrc } = req.body;

    try {
        if (!provider) {
            throw new Error('Provider not initialized');
        }
        
        // Use environment variables for private key
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(wallet);

        // Call smart contract function
        const tx = await contractWithSigner.createCommunity(
            communityName,
            country,
            location,
            peopleCount,
            travelDates,
            description,
            imageSrc
        );

        await tx.wait(); // Wait for transaction confirmation

        res.status(200).json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add a new member to the contract (must be called by the contract owner)
app.post('/addMemberOnChain', async (req, res) => {
    const { memberAddress } = req.body;
    console.log('Received request to add member on-chain:', memberAddress);
    try {
        if (!provider) {
            throw new Error('Provider not initialized');
        }
        
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY environment variable not set');
        }
        
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(wallet);

        // Check if user is already a member
        try {
            const isAlreadyMember = await contract.isMember(memberAddress);
            if (isAlreadyMember) {
                console.log('User is already a member:', memberAddress);
                return res.status(200).json({ success: true, message: 'Already a member' });
            }
        } catch (error) {
            console.log('Error checking membership, proceeding with addMember...');
        }

        const tx = await contractWithSigner.addMember(memberAddress);
        console.log('addMember transaction sent. Hash:', tx.hash);
        await tx.wait();
        console.log('addMember transaction confirmed for:', memberAddress);

        res.status(200).json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error('Error adding member on-chain:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add an endpoint to check on-chain membership
app.post('/isMemberOnChain', async (req, res) => {
    const { memberAddress } = req.body;
    try {
        if (!contract) {
            throw new Error('Contract not initialized');
        }
        
        const isMember = await contract.isMember(memberAddress);
        res.status(200).json({ isMember });
    } catch (error) {
        console.error('Error checking membership:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add endpoint to get contract owner
app.get('/contractOwner', async (req, res) => {
    try {
        if (!contract) {
            throw new Error('Contract not initialized');
        }
        
        const owner = await contract.daoOwner();
        res.status(200).json({ owner });
    } catch (error) {
        console.error('Error getting contract owner:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add health check endpoint
app.get('/health', async (req, res) => {
    try {
        if (!provider) {
            throw new Error('Provider not initialized');
        }
        
        const blockNumber = await provider.getBlockNumber();
        const network = await provider.getNetwork();
        
        res.status(200).json({ 
            status: 'healthy',
            blockNumber: blockNumber.toString(),
            network: network.name,
            rpcUrl: BSC_TESTNET_RPC_URLS[currentRpcIndex]
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy',
            error: error.message 
        });
    }
});

// Alchemy configuration
const settings = {
    apiKey: "1WNv1qCbToqe5orYWuA2jPc5w2ShtGlj", // Use environment variables for safety
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// Endpoint to get USDC balance for Vitalik
app.get("/api/vitalik-balance", async (req, res) => {
    const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik's Ethereum address
    const usdcContract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC contract address

    try {
        const balance = await alchemy.core.getTokenBalances(vitalikAddress, [usdcContract]);
        res.json({ balance: balance.tokenBalances[0]?.tokenBalance || "0" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Contract address: ${contractAddress}`);
    console.log(`Network: BSC Testnet`);
    
    // Initialize contract after server starts
    setTimeout(() => {
        initializeContract();
    }, 1000);
});
