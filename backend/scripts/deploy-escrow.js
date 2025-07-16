const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // NOTE: This Escrow contract is a pure on-chain vault. Funds deposited will be locked forever.
  // No payee or admin can withdraw. Use only for testing or as a permanent vault.
  const payeeAddress = "0xAF11b2E457530e960CE5801D23e88b2d4eB0E87d"; // Unused, but required by constructor

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(payeeAddress); // ✅ Only one param now

  await escrow.waitForDeployment();

  console.log("✅ Deployed by:", deployer.address);
  console.log("📄 Escrow contract address:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
