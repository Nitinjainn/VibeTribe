# 🔧 VibeTribe Troubleshooting Guide

## 🚨 "Missing Trie Node" & RPC Error - Complete Fix

### Problem
Users get "missing trie node" and "Internal JSON-RPC error" when trying to create proposals or interact with the blockchain.

### Root Causes
1. **BSC Testnet Node Issues**: RPC endpoints are out of sync or overloaded
2. **Network Configuration**: MetaMask not connected to correct network
3. **Contract State Issues**: Blockchain node missing recent state data

---

## ✅ Step-by-Step Fix

### 1. Start Backend Server with Multiple RPC Endpoints
```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
🚀 Starting VibeTribe Backend Server...
✅ Connected to BSC Testnet via: https://bsc-testnet.public.blastapi.io
✅ Contract initialized at: 0x043F3fc3499275C419F5E0dDbbD3Aed34F26D3b7
Server is running on http://localhost:5000
```

### 2. Use Network Troubleshooting Tool
1. Click "Troubleshoot Network" button in the UI
2. This will automatically:
   - Check MetaMask connection
   - Switch to BSC Testnet if needed
   - Verify account connection
   - Provide detailed network status

### 3. Manual Network Setup (if automatic fails)
```javascript
// In MetaMask, add BSC Testnet:
Network Name: BSC Testnet
RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
Chain ID: 97
Currency Symbol: tBNB
Block Explorer: https://testnet.bscscan.com/
```

### 4. Test with Retry Logic
The system now includes automatic retry logic for:
- Membership checks (3 retries)
- Proposal creation (3 retries)
- Contract initialization

---

## 🔍 Debug Tools

### Network Status Check
```javascript
// In browser console
import { checkNetworkConnection } from './utils/rpcUtils';
const status = await checkNetworkConnection();
console.log(status);
```

### Backend Health Check
```bash
curl http://localhost:5000/health
```

### RPC Endpoint Test
```javascript
// Test multiple RPC endpoints
import { testRpcEndpoints } from './utils/rpcUtils';
const results = await testRpcEndpoints();
console.log(results);
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Missing Trie Node" Error
**Error**: `missing trie node` or `Internal JSON-RPC error`

**Solution**:
1. Click "Troubleshoot Network" button
2. Wait 2-3 minutes and try again
3. Switch to a different RPC endpoint
4. Refresh the page

### Issue 2: Backend Connection Issues
**Error**: `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Solution**:
```bash
cd backend && npm start
```

### Issue 3: MetaMask Network Issues
**Error**: Wrong network or chain ID

**Solution**:
1. Use "Troubleshoot Network" button
2. Manually switch to BSC Testnet in MetaMask
3. Ensure Chain ID is 97 (0x61)

### Issue 4: Contract Not Found
**Error**: Contract not accessible

**Solution**:
1. Verify contract address: `0x043F3fc3499275C419F5E0dDbbD3Aed34F26D3b7`
2. Check network connection
3. Try different RPC endpoint

---

## 📋 Updated Checklist

- [ ] Backend server running with multiple RPC endpoints
- [ ] MetaMask connected to BSC Testnet (Chain ID: 97)
- [ ] User has tBNB for gas fees
- [ ] Network troubleshooting completed
- [ ] Contract accessible on current RPC
- [ ] Retry logic working
- [ ] All environment variables set

---

## 🚀 Quick Test

1. **Start Backend**:
   ```bash
   cd backend && npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend && npm run dev
   ```

3. **Test Flow**:
   - Connect MetaMask to BSC Testnet
   - Use "Troubleshoot Network" if needed
   - Join a community
   - Try creating a proposal
   - Check for retry logic working

---

## 🔄 Recent Fixes Applied

1. **Multiple RPC Endpoints**: Backend now tries multiple BSC Testnet endpoints
2. **Retry Logic**: Added automatic retries for failed operations
3. **Network Troubleshooting**: Automatic network detection and switching
4. **Better Error Messages**: More specific error handling
5. **Health Checks**: Backend health monitoring
6. **Fallback Mechanisms**: Multiple ways to handle RPC failures

---

## 📝 Technical Details

### RPC Endpoints Used
- `https://data-seed-prebsc-1-s1.binance.org:8545/`
- `https://data-seed-prebsc-2-s1.binance.org:8545/`
- `https://bsc-testnet.public.blastapi.io`
- `https://bsc-testnet.publicnode.com`
- `https://bsc-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3`

### Retry Logic
- **Membership Check**: 3 retries with 1-second delays
- **Proposal Creation**: 3 retries with 2-second delays
- **Contract Calls**: Automatic fallback to different RPC

### Error Handling
- Specific handling for "missing trie node" errors
- Network switching automation
- User-friendly error messages
- Detailed logging for debugging

---

## 🆘 Emergency Procedures

If all else fails:

1. **Switch Networks**: Try switching to mainnet and back to testnet
2. **Clear Cache**: Clear browser cache and MetaMask cache
3. **Different Browser**: Try in a different browser
4. **Wait**: Sometimes BSC Testnet nodes need time to sync
5. **Alternative RPC**: Use a different RPC endpoint manually

---

## 📞 Support

For persistent issues:
1. Check browser console for detailed errors
2. Check backend logs for RPC connection issues
3. Verify MetaMask network settings
4. Test with a fresh MetaMask account
5. Try during off-peak hours (BSC Testnet can be congested) 