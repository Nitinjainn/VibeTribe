const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CommunityVoting contract...");

  // Get the contract factory
  const CommunityVoting = await ethers.getContractFactory("CommunityVoting");
  
  // Deploy with community ID and initial members
  const communityId = "test-community-1";
  const initialMembers = [];
  const communityVoting = await CommunityVoting.deploy(communityId, initialMembers);

  // Wait for deployment (newer Hardhat syntax)
  await communityVoting.waitForDeployment();

  const address = await communityVoting.getAddress();
  console.log("CommunityVoting deployed to:", address);
  console.log("Community ID:", await communityVoting.communityId());
  console.log("Contract owner:", await communityVoting.daoOwner());
  
  // Test the selfJoin function
  const [owner] = await ethers.getSigners();
  console.log("Testing selfJoin with address:", owner.address);
  
  try {
    const tx = await communityVoting.selfJoin();
    await tx.wait();
    console.log("✅ selfJoin successful!");
    
    const isMember = await communityVoting.isMember(owner.address);
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