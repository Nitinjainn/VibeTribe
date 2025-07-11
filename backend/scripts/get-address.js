// scripts/get-address.js
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Your Wallet Address:", signer.address);
}

main();
