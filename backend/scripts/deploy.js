const hre = require("hardhat");

async function main() {
  const VibeTribe = await hre.ethers.getContractFactory("VibeTribe"); // Ensure this matches contract name
  const vibeTribe = await VibeTribe.deploy();

  await vibeTribe.waitForDeployment();

  console.log("Contract deployed to:", await vibeTribe.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
