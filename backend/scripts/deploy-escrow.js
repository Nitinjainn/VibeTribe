const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const payeeAddress = "0xAF11b2E457530e960CE5801D23e88b2d4eB0E87d"; // ✅ Receiver (trip provider)

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
