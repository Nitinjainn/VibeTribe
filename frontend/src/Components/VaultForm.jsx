import React, { useState, useEffect } from "react";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import vaultABI from "../utils/vaultABI"; // Import your ABI here

const CONTRACT_ADDRESS = "0x71C0D2A663076f58501aBfE3AC3387fEACB48075"; // Replace with actual address

const VaultForm = () => {
  const { address, isConnected } = useAccount();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Read user's current balance from contract
  const { data: userBalance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: vaultABI,
    functionName: "getBalance",
    args: [address],
    watch: true,
  });

  // Prepare deposit function
  const { config: depositConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: vaultABI,
    functionName: "deposit",
    overrides: {
      value: ethers.utils.parseEther(depositAmount || "0"),
    },
  });

  const { write: depositToVault, isLoading: isDepositing } = useContractWrite(depositConfig);

  // Prepare withdraw function
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: vaultABI,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(withdrawAmount || "0")],
  });

  const { write: withdrawFromVault, isLoading: isWithdrawing } = useContractWrite(withdrawConfig);

  return (
    <div className="max-w-md mx-auto p-4 rounded-xl shadow-md bg-white mt-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">🚀 Your Travel Vault</h2>

      <p className="text-gray-700 mb-3 text-center">
        💰 Current Balance:{" "}
        <span className="font-semibold text-green-600">
          {userBalance ? ethers.utils.formatEther(userBalance) : "0"} BNB
        </span>
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">💸 Deposit Amount (BNB)</label>
        <input
          type="number"
          step="0.001"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => depositToVault?.()}
          disabled={!depositToVault || isDepositing}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {isDepositing ? "Depositing..." : "Deposit"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">🏧 Withdraw Amount (BNB)</label>
        <input
          type="number"
          step="0.001"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => withdrawFromVault?.()}
          disabled={!withdrawFromVault || isWithdrawing}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
};

export default VaultForm;
