const hre = require("hardhat");

async function main() {
  // Deploy VibeTribe
  const VibeTribe = await hre.ethers.getContractFactory("VibeTribe");
  const vibeTribe = await VibeTribe.deploy();
  await vibeTribe.waitForDeployment();
  console.log("VibeTribe contract deployed to:", await vibeTribe.getAddress());

  // Deploy Escrow
  const [deployer] = await hre.ethers.getSigners();
  // NOTE: This Escrow contract is a pure on-chain vault. Funds deposited will be locked forever.
  // No payee or admin can withdraw. Use only for testing or as a permanent vault.
  const payeeAddress = "0xAF11b2E457530e960CE5801D23e88b2d4eB0E87d"; // Unused, but required by constructor
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(payeeAddress);
  await escrow.waitForDeployment();
  console.log("Escrow contract deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
