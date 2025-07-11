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

// Ethereum provider setup (Use environment variables for safety)
const provider = new ethers.JsonRpcProvider('YOUR_INFURA_OR_ALCHEMY_URL');

// Smart contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Route to create a community on the blockchain
app.post('/createCommunity', async (req, res) => {
    const { communityName, country, location, peopleCount, travelDates, description, imageSrc } = req.body;

    try {
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
});
