# MetaMask Authentication Integration

This directory contains utilities for handling both Firebase email/password authentication and MetaMask wallet authentication in the VibeTribe application.

## Files

### `metamaskAuth.js`
Handles MetaMask wallet connection, message signing, and user data management.

**Key Features:**
- Wallet connection and account access
- Message signing for authentication
- Signature verification
- User data creation and retrieval from Firestore
- Authentication state management
- Token expiration (24 hours)

**Usage:**
```javascript
import metamaskAuth from '../utils/metamaskAuth';

// Connect wallet and authenticate
const result = await metamaskAuth.authenticate();
if (result.success) {
  console.log('Authenticated user:', result.userData);
}
```

### `authUtils.js`
Unified authentication utility that works with both Firebase and MetaMask authentication methods.

**Key Features:**
- Check authentication status for both methods
- Get current user data regardless of auth method
- User role management
- Logout from all authentication methods
- User profile management

**Usage:**
```javascript
import authUtils from '../utils/authUtils';

// Check if user is authenticated
if (authUtils.isAuthenticated()) {
  const user = authUtils.getCurrentUser();
  const role = authUtils.getUserRole();
}
```

## Authentication Flow

### MetaMask Authentication
1. User clicks "Connect with MetaMask" button
2. MetaMask popup requests account access
3. User signs a message for authentication
4. Signature is verified on the client side
5. User data is created/retrieved from Firestore
6. Authentication data is stored in localStorage
7. User is redirected based on role

### Firebase Authentication
1. User enters email and password
2. Firebase authenticates the user
3. User data is retrieved from Firestore
4. User data is stored in localStorage
5. User is redirected based on role

## User Data Structure

### MetaMask Users
```javascript
{
  address: "0x...",
  role: "user",
  createdAt: "2024-01-01T00:00:00.000Z",
  loginMethod: "metamask",
  lastLogin: "2024-01-01T00:00:00.000Z",
  displayName: "User Name", // optional
  email: "user@example.com" // optional
}
```

### Firebase Users
```javascript
{
  uid: "firebase-uid",
  email: "user@example.com",
  role: "user",
  displayName: "User Name", // optional
  phoneNumber: "+1234567890" // optional
}
```

## Security Features

- **Message Signing**: MetaMask users must sign a unique message for authentication
- **Signature Verification**: Client-side verification ensures the signature matches the address
- **Token Expiration**: MetaMask authentication tokens expire after 24 hours
- **Role-based Access**: Both authentication methods support role-based redirects

## Integration with Existing Features

The MetaMask authentication is designed to work seamlessly with existing features:

- **Admin Panel**: Admin users can access the admin panel regardless of authentication method
- **Profile Management**: Users can update their profiles regardless of how they logged in
- **Navigation**: The navbar shows appropriate user information for both auth methods
- **Logout**: Unified logout handles both authentication methods

## Error Handling

The authentication utilities include comprehensive error handling:

- MetaMask not installed
- User rejects wallet connection
- User rejects message signing
- Network errors
- Firestore errors

All errors are logged to the console and displayed to the user via alerts.

## Browser Compatibility

- Requires MetaMask extension to be installed
- Works with all modern browsers that support MetaMask
- Gracefully degrades to email/password authentication if MetaMask is not available 