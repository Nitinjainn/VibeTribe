import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import authUtils from '../utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      const isAuth = authUtils.isAuthenticated();
      const currentUser = authUtils.getCurrentUser();
      const method = authUtils.getAuthMethod();
      
      setUser(isAuth ? currentUser : null);
      setAuthMethod(method);
      setLoading(false);
    };

    // Check immediately
    checkAuthStatus();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user is authenticated
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            setAuthMethod('firebase');
          } catch (error) {
            console.error('Error parsing user data:', error);
            setUser(firebaseUser);
            setAuthMethod('firebase');
          }
        } else {
          setUser(firebaseUser);
          setAuthMethod('firebase');
        }
      } else {
        // Check if MetaMask user is authenticated
        const isMetaMaskAuth = authUtils.isAuthenticated();
        if (isMetaMaskAuth) {
          const metaMaskUser = authUtils.getCurrentUser();
          setUser(metaMaskUser);
          setAuthMethod('metamask');
        } else {
          setUser(null);
          setAuthMethod(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      const result = await authUtils.logout();
      if (result.success) {
        setUser(null);
        setAuthMethod(null);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return authUtils.isAdmin();
  };

  const getUserRole = () => {
    return authUtils.getUserRole();
  };

  const getUserAddress = () => {
    return authUtils.getUserAddress();
  };

  const getUserEmail = () => {
    return authUtils.getUserEmail();
  };

  const getUserDisplayName = () => {
    return authUtils.getUserDisplayName();
  };

  const hasCompleteProfile = () => {
    return authUtils.hasCompleteProfile();
  };

  const updateUserData = async (updates) => {
    try {
      const result = await authUtils.updateUserData(updates);
      if (result.success) {
        setUser(result.userData);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    authMethod,
    isAuthenticated,
    isAdmin,
    getUserRole,
    getUserAddress,
    getUserEmail,
    getUserDisplayName,
    hasCompleteProfile,
    logout,
    updateUserData
  };
}; 