const hre = require("hardhat");

async function main() {
  const members = []; // Add addresses if needed

  const TripVoting = await hre.ethers.getContractFactory("TripVoting");
  const tripVoting = await TripVoting.deploy(members);

  await tripVoting.waitForDeployment();

  const address = await tripVoting.getAddress();
  console.log("TripVoting deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});