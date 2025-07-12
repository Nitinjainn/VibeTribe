const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TravelVault", function () {
  let TravelVault;
  let vault;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    TravelVault = await ethers.getContractFactory("TravelVault");
    vault = await TravelVault.deploy();
    await vault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await vault.getAddress()).to.be.properAddress;
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit", async function () {
      const depositAmount = ethers.parseEther("0.1");
      
      await expect(vault.connect(user1).deposit({ value: depositAmount }))
        .to.emit(vault, "Deposited")
        .withArgs(user1.address, depositAmount, await ethers.provider.getBlock("latest").then(block => block.timestamp));

      expect(await vault.getBalance(user1.address)).to.equal(depositAmount);
      expect(await vault.getDepositCount(user1.address)).to.equal(1);
    });

    it("Should reject deposits below minimum", async function () {
      const smallAmount = ethers.parseEther("0.0005"); // Below 0.001 minimum
      
      await expect(vault.connect(user1).deposit({ value: smallAmount }))
        .to.be.revertedWith("Minimum deposit is 0.001 BNB");
    });

    it("Should reject zero deposits", async function () {
      await expect(vault.connect(user1).deposit({ value: 0 }))
        .to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("Should track deposit count correctly", async function () {
      const depositAmount = ethers.parseEther("0.1");
      
      // First deposit
      await vault.connect(user1).deposit({ value: depositAmount });
      expect(await vault.getDepositCount(user1.address)).to.equal(1);
      
      // Second deposit
      await vault.connect(user1).deposit({ value: depositAmount });
      expect(await vault.getDepositCount(user1.address)).to.equal(2);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // Setup: user1 deposits some funds
      await vault.connect(user1).deposit({ value: ethers.parseEther("0.5") });
    });

    it("Should allow users to withdraw", async function () {
      const withdrawAmount = ethers.parseEther("0.2");
      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      await expect(vault.connect(user1).withdraw(withdrawAmount))
        .to.emit(vault, "Withdrawn")
        .withArgs(user1.address, withdrawAmount, await ethers.provider.getBlock("latest").then(block => block.timestamp));

      expect(await vault.getBalance(user1.address)).to.equal(ethers.parseEther("0.3"));
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const tooMuch = ethers.parseEther("1.0");
      
      await expect(vault.connect(user1).withdraw(tooMuch))
        .to.be.revertedWith("Insufficient balance");
    });

    it("Should reject zero withdrawals", async function () {
      await expect(vault.connect(user1).withdraw(0))
        .to.be.revertedWith("Withdrawal amount must be greater than 0");
    });
  });

  describe("NFT Eligibility", function () {
    it("Should not be eligible initially", async function () {
      expect(await vault.isEligibleForNFT(user1.address)).to.be.false;
    });

    it("Should become eligible after 5 deposits", async function () {
      const depositAmount = ethers.parseEther("0.1");
      
      // Make 4 deposits
      for (let i = 0; i < 4; i++) {
        await vault.connect(user1).deposit({ value: depositAmount });
      }
      expect(await vault.isEligibleForNFT(user1.address)).to.be.false;
      
      // Make 5th deposit
      await vault.connect(user1).deposit({ value: depositAmount });
      expect(await vault.isEligibleForNFT(user1.address)).to.be.true;
    });
  });

  describe("Multiple Users", function () {
    it("Should handle multiple users independently", async function () {
      const depositAmount = ethers.parseEther("0.1");
      
      // User1 deposits
      await vault.connect(user1).deposit({ value: depositAmount });
      expect(await vault.getBalance(user1.address)).to.equal(depositAmount);
      expect(await vault.getBalance(user2.address)).to.equal(0);
      
      // User2 deposits
      await vault.connect(user2).deposit({ value: depositAmount });
      expect(await vault.getBalance(user2.address)).to.equal(depositAmount);
      expect(await vault.getBalance(user1.address)).to.equal(depositAmount);
    });
  });
}); 