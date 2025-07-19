   // backend/scripts/deploy-escrow-and-update-firestore.js
   const { ethers } = require("hardhat");
   const admin = require("firebase-admin");
   const serviceAccount = require("../firebase-service-account.json"); // update path if needed

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   const db = admin.firestore();

   async function main() {
     const communityId = process.argv[2];
     if (!communityId) {
       console.error("Usage: node deploy-escrow-and-update-firestore.js <communityId>");
       process.exit(1);
     }

     // 1. Deploy Escrow contract
     const Escrow = await ethers.getContractFactory("Escrow");
     const escrow = await Escrow.deploy();
     await escrow.deployed();
     console.log("Escrow deployed to:", escrow.address);

     // 2. Update Firestore
     await db.collection("communities").doc(communityId).update({
       escrowAddress: escrow.address
     });
     console.log("Firestore updated for community:", communityId);
   }

   main().catch((error) => {
     console.error(error);
     process.exit(1);
   });