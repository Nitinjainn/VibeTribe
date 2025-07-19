const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying updated TripVoting contract...");

  // Get the contract factory
  const TripVoting = await ethers.getContractFactory("TripVoting");
  
  // Deploy with initial members (empty array for now)
  const initialMembers = [];
  const tripVoting = await TripVoting.deploy(initialMembers);

  // Wait for deployment (newer Hardhat syntax)
  await tripVoting.waitForDeployment();

  const address = await tripVoting.getAddress();
  console.log("Updated TripVoting deployed to:", address);
  console.log("Contract owner:", await tripVoting.daoOwner());
  
  // Test the selfJoin function
  const [owner] = await ethers.getSigners();
  console.log("Testing selfJoin with address:", owner.address);
  
  try {
    const tx = await tripVoting.selfJoin();
    await tx.wait();
    console.log("✅ selfJoin successful!");
    
    const isMember = await tripVoting.isMember(owner.address);
    console.log("Is member after selfJoin:", isMember);
  } catch (error) {
    console.error("❌ selfJoin failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 