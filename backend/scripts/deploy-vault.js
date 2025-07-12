const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying TravelVault contract...");
  
  try {
    const TravelVault = await ethers.getContractFactory("TravelVault");
    const vault = await TravelVault.deploy();

    console.log("⏳ Waiting for deployment to be mined...");
    
    // Wait for deployment to be mined (ethers v6)
    await vault.waitForDeployment(); // this replaces vault.deployed()

    const vaultAddress = await vault.getAddress();
    console.log("✅ TravelVault deployed successfully!");
    console.log("📍 Contract Address:", vaultAddress);
    console.log("🔗 BSCScan URL: https://testnet.bscscan.com/address/" + vaultAddress);
    
    // Verify the deployment
    console.log("🔍 Verifying deployment...");
    const deployedCode = await ethers.provider.getCode(vaultAddress);
    if (deployedCode === "0x") {
      console.log("❌ Contract deployment failed - no code at address");
      process.exit(1);
    } else {
      console.log("✅ Contract code verified at address");
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  });
