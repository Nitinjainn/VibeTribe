import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";

const contractAddress = "0x00fA50fC3ecf88A8520f8895f4A9DB1a6C8bDd95";
const abi =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "investor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "InvestmentReceived",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];


const DonationPage = () => {
  const [account, setAccount] = useState("");
  const [donationAmountETH, setDonationAmountETH] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMess, setErrorMess] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          // Get initial balance
          getBalance(address);
        } catch {
          setErrorMess("Failed to connect wallet. Please try again.");
        }
      }
    };
    connectWallet();
  }, []);

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const investFunds = async () => {
    if (!window.ethereum) {
      setErrorMess("Please install MetaMask to continue");
      return;
    }
    if (!donationAmountETH || parseFloat(donationAmountETH) <= 0) {
      setErrorMess("Please enter a valid amount");
      return;
    }
    setLoading(true);
    setErrorMess("");
    setTxHash("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.invest({
        value: ethers.parseEther(donationAmountETH),
      });
      setTxHash(tx.hash);
      await tx.wait();

      // Update balance after successful transaction
      getBalance(account);
      setDonationAmountETH("");
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMess(error.message || "Transaction failed. Please try again.");
    }
    setLoading(false);
  };

  const getBalance = async (userAddress) => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const userBalance = await contract.getBalance(userAddress || account);
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error("Balance fetch failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      <main className="flex-1 relative bg-gradient-to-b from-teal-100 to-white">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.2)_25%,rgba(34,197,94,0.2)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.2)_75%,rgba(34,197,94,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-teal-600 mb-3">
                InvestCycle
              </h1>
              <p className="text-gray-600">
                Decentralized Investment Pool for Travelers
              </p>
            </div>

            <div className="bg-teal-50/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Wallet Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    account
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {account ? "Connected" : "Not Connected"}
                </span>
              </div>
              {account && (
                <div className="text-sm text-gray-600 font-mono">
                  {shortenAddress(account)}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={donationAmountETH}
                    onChange={(e) => setDonationAmountETH(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none bg-white/50 backdrop-blur-sm"
                    step="0.01"
                    min="0"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    ETH
                  </span>
                </div>
              </div>

              <button
                onClick={investFunds}
                disabled={loading || !account}
                className={`w-full py-4 rounded-lg font-semibold text-lg ${
                  loading || !account
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-[1.02] transition-all"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Contribute ETH"
                )}
              </button>

              {balance !== null && (
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-teal-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Your Balance</span>
                    <span className="text-lg font-semibold text-teal-600">
                      {balance} ETH
                    </span>
                  </div>
                  <button
                    onClick={() => getBalance(account)}
                    className="mt-2 w-full py-2 text-sm text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Refresh Balance
                  </button>
                </div>
              )}

              {txHash && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-700 text-sm">
                    Transaction submitted! Track it here:
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1 font-mono text-xs hover:underline"
                    >
                      {shortenAddress(txHash)}
                    </a>
                  </p>
                </div>
              )}

              {errorMess && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                  {errorMess}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;
