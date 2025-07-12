import { ethers } from 'ethers';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

class MetaMaskAuth {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }

  // Connect to MetaMask
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      this.address = accounts[0];
      
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = await provider.getSigner();

      return {
        success: true,
        address: this.address,
        provider: this.provider,
        signer: this.signer
      };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign a message for authentication
  async signMessage(message = 'Sign this message to authenticate with VibeTribe') {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected. Please connect your MetaMask wallet first.');
      }

      const signature = await this.signer.signMessage(message);
      return {
        success: true,
        signature,
        message,
        address: this.address
      };
    } catch (error) {
      console.error('Error signing message:', error);
      
      // Handle specific MetaMask rejection errors
      if (error.code === 4001 || error.message.includes('User rejected') || error.message.includes('user denied')) {
        return {
          success: false,
          error: 'You rejected the signature request. Please try again and sign the message to complete authentication.'
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify signature
  async verifySignature(message, signature, address) {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  // Get or create user data in Firestore
  async getUserData(address) {
    try {
      const userDocRef = doc(db, 'users', address);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data(),
          exists: true
        };
      } else {
        // Create new user data
        const newUserData = {
          address: address,
          role: 'user',
          createdAt: new Date().toISOString(),
          loginMethod: 'metamask',
          lastLogin: new Date().toISOString(),
          profileComplete: false
        };

        await setDoc(userDocRef, newUserData);
        
        return {
          success: true,
          data: newUserData,
          exists: false
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create enhanced user profile for signup
  async createEnhancedUserProfile(address, profileData) {
    try {
      const userDocRef = doc(db, 'users', address);
      
      const enhancedUserData = {
        address: address,
        role: 'user',
        createdAt: new Date().toISOString(),
        loginMethod: 'metamask',
        lastLogin: new Date().toISOString(),
        profileComplete: true,
        ...profileData
      };

      await setDoc(userDocRef, enhancedUserData);
      
      return {
        success: true,
        data: enhancedUserData
      };
    } catch (error) {
      console.error('Error creating enhanced user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Complete MetaMask authentication
  async authenticate() {
    try {
      // Step 1: Connect wallet
      const connection = await this.connectWallet();
      if (!connection.success) {
        throw new Error(connection.error);
      }

      // Step 2: Create user-friendly message
      const timestamp = new Date().toLocaleString();
      const message = `Welcome to VibeTribe!

Please sign this message to authenticate your wallet.

Wallet Address: ${this.address}
Timestamp: ${timestamp}

This signature is used to verify that you own this wallet address. No transaction will be made and no funds will be transferred.`;

      const signature = await this.signMessage(message);
      if (!signature.success) {
        throw new Error(signature.error);
      }

      // Step 3: Verify signature
      const isValid = await this.verifySignature(message, signature.signature, this.address);
      if (!isValid) {
        throw new Error('Signature verification failed');
      }

      // Step 4: Get or create user data
      const userData = await this.getUserData(this.address);
      if (!userData.success) {
        throw new Error(userData.error);
      }

      // Step 5: Store authentication data in localStorage
      const authData = {
        address: this.address,
        signature: signature.signature,
        message: message,
        loginMethod: 'metamask',
        timestamp: Date.now()
      };

      localStorage.setItem('metamaskAuth', JSON.stringify(authData));
      localStorage.setItem('userData', JSON.stringify(userData.data));

      return {
        success: true,
        userData: userData.data,
        authData: authData,
        isNewUser: !userData.exists
      };
    } catch (error) {
      console.error('MetaMask authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if user is authenticated via MetaMask
  isAuthenticated() {
    const authData = localStorage.getItem('metamaskAuth');
    if (!authData) return false;

    try {
      const parsed = JSON.parse(authData);
      const now = Date.now();
      const authAge = now - parsed.timestamp;
      
      // Token expires after 24 hours
      if (authAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('metamaskAuth');
        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem('metamaskAuth');
      return false;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('metamaskAuth');
    localStorage.removeItem('userData');
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  }

  // Check if user has complete profile
  hasCompleteProfile() {
    const userData = this.getCurrentUser();
    if (!userData) return false;
    
    return userData.profileComplete === true;
  }

  // Get user display name
  getUserDisplayName() {
    const userData = this.getCurrentUser();
    if (!userData) return 'User';
    
    return userData.displayName || userData.name || userData.address || 'User';
  }
}

export default new MetaMaskAuth(); 