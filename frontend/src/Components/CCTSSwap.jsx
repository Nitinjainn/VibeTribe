import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";

const contractAddress = "0xeB3865a56e3EBeaF456Ff196C94A6c42fDE73EEb";

const abi = [
    "event SwapProposed(uint256 indexed swapId, address indexed proposerDAO, address indexed counterpartyDAO)",
    "event SwapAccepted(uint256 indexed swapId)",
    "event SwapSettled(uint256 indexed swapId)",
    "event SwapCancelled(uint256 indexed swapId)",
    "event EscrowDeposited(uint256 indexed swapId, address indexed dao, uint256 amount)",
    "function proposeSwap(address counterpartyDAO, string proposerDetails, string counterpartyDetails, uint256 proposerAmount, uint256 counterpartyAmount) payable returns (uint256)",
    "function acceptSwap(uint256 swapId) payable",
    "function settleSwap(uint256 swapId)",
    "function cancelSwap(uint256 swapId)",
    "function getSwap(uint256 swapId) view returns (tuple(address proposerDAO, address counterpartyDAO, string proposerDetails, string counterpartyDetails, uint256 proposerAmount, uint256 counterpartyAmount, uint8 status, address escrowedBy))",
    "function swapCount() view returns (uint256)"
];

const statusMap = ["Proposed", "Accepted", "Settled", "Cancelled"];

const CCTSSwap = () => {
    const [account, setAccount] = useState("");
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [swaps, setSwaps] = useState([]);
    const [form, setForm] = useState({
        counterpartyDAO: "",
        proposerDetails: "",
        counterpartyDetails: "",
        proposerAmount: "",
        counterpartyAmount: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const normalize = (addr) => {
        try {
            return addr?.toLowerCase();
        } catch {
            return "0x0000000000000000000000000000000000000000";
        }
    };


    useEffect(() => {
        if (window.ethereum) {
            const p = new ethers.BrowserProvider(window.ethereum);
            setProvider(p);
        }
    }, []);

    useEffect(() => {
        if (provider) {
            setContract(new ethers.Contract(contractAddress, abi, provider));
        }
    }, [provider]);

    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please install MetaMask");
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            const connectedContract = new ethers.Contract(contractAddress, abi, signer);
            setContract(connectedContract);
            fetchSwaps();
        } catch (e) {
            setError("Wallet connection failed");
        }
    };

    const fetchSwaps = async () => {
        if (!contract) return;
        try {
            const count = await contract.swapCount();
            const arr = [];
            for (let i = 0; i < count; i++) {
                const s = await contract.getSwap(i);
                arr.push({
                    proposerDAO: s[0],
                    counterpartyDAO: s[1],
                    proposerDetails: s[2],
                    counterpartyDetails: s[3],
                    proposerAmount: s[4],
                    counterpartyAmount: s[5],
                    status: s[6],
                    escrowedBy: s[7],
                    swapId: i,
                });
            }
            setSwaps(arr);
        } catch (e) {
            console.error("Fetch error:", e);
            setError("Failed to fetch swaps");
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", () => {
                window.location.reload();
            });
        }
    }, []);

    useEffect(() => {
        if (contract && account) {
            fetchSwaps();
            const interval = setInterval(fetchSwaps, 10000);
            return () => clearInterval(interval);
        }
    }, [contract, account]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const proposeSwap = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!ethers.isAddress(form.counterpartyDAO)) {
                throw new Error("Invalid counterparty address");
            }

            const tx = await contract.proposeSwap(
                form.counterpartyDAO,
                form.proposerDetails,
                form.counterpartyDetails,
                ethers.parseEther(form.proposerAmount),
                ethers.parseEther(form.counterpartyAmount),
                { value: ethers.parseEther(form.proposerAmount) }
            );

            await tx.wait();
            setSuccess("Swap proposed!");
            setForm({
                counterpartyDAO: "",
                proposerDetails: "",
                counterpartyDetails: "",
                proposerAmount: "",
                counterpartyAmount: ""
            });
            fetchSwaps();
        } catch (e) {
            console.error("Propose error:", e);
            setError(e.reason || e.message || "Proposal failed");
        }
        setLoading(false);
    };

    const acceptSwap = async (swap) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const tx = await contract.acceptSwap(swap.swapId, {
                value: swap.counterpartyAmount
            });
            await tx.wait();
            setSuccess("Swap accepted!");
            fetchSwaps();
        } catch (e) {
            setError(e.message || "Accept failed");
        }
        setLoading(false);
    };

    const settleSwap = async (swap) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const tx = await contract.settleSwap(swap.swapId);
            await tx.wait();
            setSuccess("Swap settled!");
            fetchSwaps();
        } catch (e) {
            setError(e.message || "Settle failed");
        }
        setLoading(false);
    };

    const cancelSwap = async (swap) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const tx = await contract.cancelSwap(swap.swapId);
            await tx.wait();
            setSuccess("Swap cancelled!");
            fetchSwaps();
        } catch (e) {
            setError(e.message || "Cancel failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white pt-10">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="bg-teal-100/80 border-l-4 border-teal-500 rounded-xl p-5 mb-8 shadow flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-teal-700 mb-1">How to Use CCTS</h2>
                    <ul className="list-disc pl-6 text-teal-900 text-sm">
                        <li>Connect your wallet (BNB Testnet recommended).</li>
                        <li>Propose a swap by filling the form and sending your escrow.</li>
                        <li>Other party accepts with their escrow, then settle or cancel.</li>
                    </ul>
                </div>

                <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">Cross-Community Travel Swap (CCTS)</h1>

                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <form onSubmit={proposeSwap} className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
                        <h2 className="text-xl font-bold mb-4 text-teal-700">Propose a Swap</h2>
                        {["counterpartyDAO", "proposerDetails", "counterpartyDetails", "proposerAmount", "counterpartyAmount"].map((key, i) => (
                            <div key={i} className="mb-3">
                                <label className="block text-sm font-semibold text-teal-700 mb-1">
                                    {key === "counterpartyDAO" ? "Counterparty DAO Address" :
                                        key === "proposerDetails" ? "Your Offer Details" :
                                            key === "counterpartyDetails" ? "Expected from Counterparty" :
                                                key === "proposerAmount" ? "Your Escrow Amount (BNB)" :
                                                    "Counterparty Escrow Amount (BNB)"}
                                </label>
                                <input
                                    name={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    type={key.includes("Amount") ? "number" : "text"}
                                    min="0"
                                    step="any"
                                    placeholder={key.includes("Amount") ? "e.g. 0.01" : "e.g. 1 seat in Paris trip"}
                                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-teal-300"
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-xl font-medium w-full" disabled={loading}>
                            {loading ? "Proposing..." : "Propose Swap"}
                        </button>
                        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
                        {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
                    </form>

                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-8 border border-teal-100 min-h-[300px]">
                        <button onClick={connectWallet} className="mb-4 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-xl font-medium text-lg">
                            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
                        </button>
                        <div className="text-gray-600 text-sm text-center">Connect your wallet to interact with swaps.</div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-teal-700">All Swaps</h2>
                <div className="grid gap-6">
                    {swaps.length === 0 && <div className="text-gray-500 text-center">No swaps yet.</div>}
                    {swaps.map((swap, idx) => {
                        const normalizedAccount = account ? normalize(account) : null;
                        const normalizedProposer = normalize(swap.proposerDAO);
                        const normalizedCounterparty = normalize(swap.counterpartyDAO);

                        const isProposer = normalizedAccount === normalizedProposer;
                        const isCounterparty =
                            normalizedAccount &&
                            normalizedCounterparty !== "0x0000000000000000000000000000000000000000" &&
                            normalizedAccount === normalizedCounterparty;

                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl shadow-lg border-2 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between ${swap.status === 0
                                        ? "border-yellow-300 bg-yellow-50/60"
                                        : swap.status === 1

                                            ? "border-blue-300 bg-blue-50/60"
                                            : swap.status === 2
                                                ? "border-green-400 bg-green-50/60"
                                                : "border-gray-300 bg-gray-50/60"
                                    }`}
                            >
                                {/* Left Details */}
                                <div className="mb-4 md:mb-0">
                                    <div className="font-bold text-lg text-teal-800">
                                        Swap #{swap.swapId}{" "}
                                        <span className="text-xs font-normal text-gray-500">
                                            ({statusMap[swap.status]})
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Proposer: <span className="font-mono">{swap.proposerDAO}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Counterparty:{" "}
                                        <span className="font-mono">{swap.counterpartyDAO}</span>
                                    </div>
                                    <div className="text-sm mt-1">
                                        Offer:{" "}
                                        <span className="font-semibold text-teal-700">
                                            {swap.proposerDetails}
                                        </span>{" "}
                                        <span className="text-gray-500">
                                            ({ethers.formatEther(swap.proposerAmount || 0)} BNB)
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        Wants:{" "}
                                        <span className="font-semibold text-teal-700">
                                            {swap.counterpartyDetails}
                                        </span>{" "}
                                        <span className="text-gray-500">
                                            ({ethers.formatEther(swap.counterpartyAmount || 0)} BNB)
                                        </span>
                                    </div>
                                </div>

                                {/* Right Buttons */}
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    {Number(swap.status) === 0 && isCounterparty && (
                                        <button onClick={() => acceptSwap(swap)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                                            Accept
                                        </button>
                                    )}

                                    {Number(swap.status) === 1 && (isProposer || isCounterparty) && (
                                        <button onClick={() => settleSwap(swap)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
                                            Settle
                                        </button>
                                    )}

                                    {Number(swap.status) === 0 && isProposer && (
                                        <button onClick={() => cancelSwap(swap)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow">
                                            Cancel
                                        </button>
                                    )}

                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default CCTSSwap;
