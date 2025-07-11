import { auth } from '../firebaseConfig';
import metamaskAuth from './metamaskAuth';
import authUtils from './authUtils';

export const debugAuth = () => {
  console.log('=== AUTH DEBUG INFO ===');
  const isAuth = authUtils.isAuthenticated();
  console.log('Is Authenticated:', isAuth);
  const currentUser = authUtils.getCurrentUser();
  console.log('Current User:', currentUser);
  const authMethod = authUtils.getAuthMethod();
  console.log('Auth Method:', authMethod);
  const isMetaMaskAuth = metamaskAuth.isAuthenticated();
  console.log('MetaMask Authenticated:', isMetaMaskAuth);
  const userData = localStorage.getItem('userData');
  const metamaskAuthData = localStorage.getItem('metamaskAuth');
  console.log('localStorage userData:', userData);
  console.log('localStorage metamaskAuth:', metamaskAuthData);
  // Use the imported auth directly
  console.log('Firebase currentUser:', auth.currentUser);
  console.log('=== END AUTH DEBUG ===');
  return {
    isAuthenticated: isAuth,
    currentUser,
    authMethod,
    isMetaMaskAuth,
    userData: userData ? JSON.parse(userData) : null,
    metamaskAuthData: metamaskAuthData ? JSON.parse(metamaskAuthData) : null,
    firebaseUser: auth.currentUser
  };
};

if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}