// scripts/deploy-cross-community-swap.js
const { ethers } = require("hardhat");

async function main() {
  const CrossCommunitySwap = await ethers.getContractFactory("CrossCommunitySwap");
  const contract = await CrossCommunitySwap.deploy();

  // Await proper deployment using ethers v6 syntax
  await contract.waitForDeployment();

  console.log("CrossCommunitySwap deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
