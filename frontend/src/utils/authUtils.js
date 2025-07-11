import { auth } from '../firebaseConfig';
import metamaskAuth from './metamaskAuth';

class AuthUtils {
  // Check if user is authenticated (either via Firebase or MetaMask)
  isAuthenticated() {
    // Check Firebase auth
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return true;
    }

    // Check MetaMask auth
    if (metamaskAuth.isAuthenticated()) {
      return true;
    }

    return false;
  }

  // Get current user data
  getCurrentUser() {
    // Try to get Firebase user first
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing Firebase user data:', error);
        }
      }
    }

    // Try to get MetaMask user
    const metamaskUser = metamaskAuth.getCurrentUser();
    if (metamaskUser) {
      return metamaskUser;
    }

    return null;
  }

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    if (user) {
      return (user.role || 'user').toLowerCase();
    }
    return 'user';
  }

  // Check if user is admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  // Logout from all authentication methods
  async logout() {
    try {
      // Logout from Firebase
      if (auth.currentUser) {
        await auth.signOut();
      }

      // Logout from MetaMask
      metamaskAuth.logout();

      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('metamaskAuth');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get authentication method
  getAuthMethod() {
    if (auth.currentUser) {
      return 'firebase';
    }
    
    if (metamaskAuth.isAuthenticated()) {
      return 'metamask';
    }

    return null;
  }

  // Get user address (for MetaMask users)
  getUserAddress() {
    const user = this.getCurrentUser();
    if (user && user.address) {
      return user.address;
    }
    return null;
  }

  // Get user email (for Firebase users)
  getUserEmail() {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return firebaseUser.email;
    }
    
    // Check MetaMask user for email
    const metamaskUser = metamaskAuth.getCurrentUser();
    if (metamaskUser && metamaskUser.email) {
      return metamaskUser.email;
    }
    
    return null;
  }

  // Get user display name
  getUserDisplayName() {
    const user = this.getCurrentUser();
    if (user) {
      return user.displayName || user.name || user.email || user.address || 'User';
    }
    return 'User';
  }

  // Check if user has completed profile
  hasCompleteProfile() {
    const user = this.getCurrentUser();
    if (!user) return false;

    // For MetaMask users, check if they have additional profile info
    if (user.loginMethod === 'metamask') {
      return user.profileComplete === true;
    }

    // For Firebase users, check if they have additional profile info
    return user.displayName || user.phoneNumber;
  }

  // Update user data
  async updateUserData(updates) {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const updatedData = { ...user, ...updates, lastUpdated: new Date().toISOString() };
      
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(updatedData));

      // Update Firestore if user has a UID (Firebase user)
      if (auth.currentUser) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../firebaseConfig');
        await updateDoc(doc(db, 'users', auth.currentUser.uid), updates);
      }

      // Update Firestore for MetaMask users
      if (user.address) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../firebaseConfig');
        await updateDoc(doc(db, 'users', user.address), updates);
      }

      return { success: true, userData: updatedData };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false, error: error.message };
    }
  }

  // Create enhanced user profile for MetaMask signup
  async createEnhancedUserProfile(profileData) {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.address) {
        throw new Error('No authenticated MetaMask user found');
      }

      const result = await metamaskAuth.createEnhancedUserProfile(user.address, profileData);
      
      if (result.success) {
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(result.data));
        return { success: true, userData: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error creating enhanced user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is new (for MetaMask users)
  isNewUser() {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // For MetaMask users, check if profile is complete
    if (user.loginMethod === 'metamask') {
      return !user.profileComplete;
    }
    
    return false;
  }

  // Get user profile completion status
  getProfileCompletionStatus() {
    const user = this.getCurrentUser();
    if (!user) return { complete: false, missing: ['authentication'] };
    
    const missing = [];
    
    if (!user.name && !user.displayName) missing.push('name');
    if (!user.email) missing.push('email');
    if (user.loginMethod === 'metamask' && !user.profileComplete) missing.push('profile');
    
    return {
      complete: missing.length === 0,
      missing: missing
    };
  }
}

export default new AuthUtils(); 