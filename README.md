# VibeTribe - Personalized Travel Vault

A decentralized application (dApp) that provides personalized travel vaults for users to save and invest in their travel goals. Each user gets their own non-custodial vault where they can deposit funds anytime and withdraw when needed.

## Features

### 🏦 Personalized Travel Vault
- **Non-custodial**: Users maintain full control of their funds
- **Personal vaults**: Each user has their own isolated vault
- **Flexible deposits**: Monthly, one-time, or any frequency
- **Instant withdrawals**: Withdraw anytime without restrictions

### 💰 Smart Contract Features
- **Minimum deposit**: 0.001 BNB to prevent dust attacks
- **Deposit tracking**: Counts total deposits per user
- **NFT eligibility**: Users become eligible for NFTs after 5 deposits
- **Streak milestones**: Tracks saving streaks for gamification
- **Secure withdrawals**: Only vault owner can withdraw their funds

### 🎯 User Experience
- **MetaMask integration**: Seamless wallet connection
- **Real-time balance**: Live updates of vault balance
- **Transaction tracking**: Real-time transaction status
- **Mobile responsive**: Works on all devices
- **Balance popup**: Quick access to vault information

## Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum

### Backend
- **Solidity**: Smart contract language
- **Hardhat**: Development environment
- **BSC Testnet**: Binance Smart Chain test network

## Quick Start

### Prerequisites
- Node.js 16+ 
- MetaMask wallet
- BSC Testnet BNB for gas fees

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VibeTribe
```

2. **Install dependencies**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Deploy the smart contract**
```bash
cd ../backend
npx hardhat run scripts/deploy-vault.js --network bscTestnet
```

4. **Update contract address**
Copy the deployed contract address and update it in:
- `frontend/src/Components/DonationPage.jsx` (line 6)

5. **Start the frontend**
```bash
cd ../frontend
npm run dev
```

6. **Connect MetaMask**
- Open MetaMask
- Switch to BSC Testnet
- Connect to the dApp
- Ensure you have test BNB for transactions

## Usage

### Connecting Wallet
1. Click "Connect MetaMask" button
2. Approve the connection in MetaMask
3. Ensure you're on BSC Testnet

### Depositing Funds
1. Enter the amount you want to deposit (minimum 0.001 BNB)
2. Click "Deposit" button
3. Confirm the transaction in MetaMask
4. Wait for transaction confirmation

### Withdrawing Funds
1. Enter the amount you want to withdraw
2. Click "Withdraw" button
3. Confirm the transaction in MetaMask
4. Funds will be sent to your wallet

### Checking Balance
- **Main display**: Shows current vault balance
- **Balance button**: Click the 💰 button in top-right for detailed info
- **User stats**: View deposit count and last deposit time

## Smart Contract Details

### Contract Address
```
0x71C0D2A663076f58501aBfE3AC3387fEACB48075 (BSC Testnet)
```

### Key Functions
- `deposit()`: Add funds to your vault
- `withdraw(uint256 amount)`: Withdraw funds from your vault
- `getBalance(address user)`: Get user's vault balance
- `getDepositCount(address user)`: Get user's deposit count
- `isEligibleForNFT(address user)`: Check NFT eligibility

### Events
- `Deposited(address user, uint256 amount, uint256 timestamp)`
- `Withdrawn(address user, uint256 amount, uint256 timestamp)`
- `StreakMilestone(address user, uint256 depositCount)`

## Security Features

### Non-Custodial Design
- Users maintain full control of their funds
- No admin can access user funds
- Funds are stored in individual user vaults

### Smart Contract Security
- Minimum deposit requirements prevent dust attacks
- Proper access controls ensure only vault owners can withdraw
- Safe transfer patterns prevent reentrancy attacks
- Comprehensive input validation

### Frontend Security
- MetaMask integration for secure transactions
- Transaction confirmation dialogs
- Error handling and user feedback
- No private key storage

## Testing

### Run Contract Tests
```bash
cd backend
npx hardhat test
```

### Test Coverage
- Contract deployment
- Deposit functionality
- Withdrawal functionality
- NFT eligibility
- Multi-user scenarios
- Error conditions

## Development

### Adding New Features
1. Update the smart contract in `backend/contracts/TravelVault.sol`
2. Update the ABI in `frontend/src/utils/vaultABI.js`
3. Update the frontend components
4. Test thoroughly before deployment

### Deployment
```bash
# Deploy to testnet
npx hardhat run scripts/deploy-vault.js --network bscTestnet

# Deploy to mainnet (when ready)
npx hardhat run scripts/deploy-vault.js --network bscMainnet
```

## Troubleshooting

### Common Issues

**MetaMask not connecting**
- Ensure MetaMask is installed and unlocked
- Check if you're on BSC Testnet
- Try refreshing the page

**Transaction fails**
- Ensure you have enough BNB for gas fees
- Check if the amount meets minimum requirements
- Verify you have sufficient balance for withdrawals

**Balance not updating**
- Wait for transaction confirmation
- Try refreshing the page
- Check transaction hash on BSCScan

### Support
For issues or questions:
1. Check the transaction on BSCScan
2. Verify MetaMask network settings
3. Ensure sufficient BNB for gas fees

## Roadmap

### Future Features
- **NFT rewards**: Mint NFTs for saving milestones
- **Interest earning**: Earn interest on vault deposits
- **Social features**: Share savings goals with friends
- **Mobile app**: Native mobile application
- **Multi-chain**: Support for other blockchains

### Planned Improvements
- **Gas optimization**: Reduce transaction costs
- **UI/UX enhancements**: Better user interface
- **Analytics**: Track savings progress
- **Notifications**: Transaction alerts

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

---

**Built with ❤️ for the travel community**
