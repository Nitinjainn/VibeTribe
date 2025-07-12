import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import vaultABI from '../utils/vaultABI'
import Navbar from './Navbar'

const CONTRACT_ADDRESS = "0xF40F5B5466DD0347071c5Ff51F8240df71Aa665f"
const BSC_TESTNET_RPCS = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://bsc-testnet.publicnode.com'
];
const BLOCK_RANGE = 100;

const DonationPage = () => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [userBalance, setUserBalance] = useState(() => localStorage.getItem('vaultBalance') || '0')
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectPopup, setShowConnectPopup] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [historyFromBlock, setHistoryFromBlock] = useState(null);

  // Step 1: Ensure Proper Wallet Connection
  const [signer, setSigner] = useState(null);

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkWalletConnection()
  }, [])

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // Check if user is on correct network (BSC Testnet)
  const checkCorrectNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0x61') {
        showToast('Please switch to BSC Testnet', 'error')
        return false
      }
      return true
    } catch (error) {
      console.error('Error checking network:', error)
      return false
    }
  }

  // Switch to BSC Testnet
  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      })
      showToast('Switched to BSC Testnet', 'success')
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x61',
            chainName: 'BSC Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'tBNB',
              decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
          }],
        })
      }
    }
  }

  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          console.log('Wallet already connected:', accounts[0])
          await initializeWallet(accounts[0])
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  // Debug function to test contract connection
  const debugContract = async () => {
    if (!contract) {
      console.log('No contract instance available')
      return
    }
    
    try {
      console.log('=== CONTRACT DEBUG INFO ===')
      console.log('Contract address:', CONTRACT_ADDRESS)
      console.log('Contract instance:', contract)
      
      // Test basic contract calls
      const provider = contract.provider
      const network = await provider.getNetwork()
      console.log('Network:', network)
      
      const currentBlock = await provider.getBlockNumber()
      console.log('Current block:', currentBlock)
      
      // Test event listening
      console.log('Setting up test event listeners...')
      contract.on('Deposited', (user, amount, timestamp) => {
        console.log('🔵 DEPOSIT EVENT DETECTED:', {
          user,
          amount: ethers.utils.formatEther(amount),
          timestamp: new Date(timestamp * 1000).toLocaleString()
        })
      })
      
      contract.on('Withdrawn', (user, amount, timestamp) => {
        console.log('🔴 WITHDRAW EVENT DETECTED:', {
          user,
          amount: ethers.utils.formatEther(amount),
          timestamp: new Date(timestamp * 1000).toLocaleString()
        })
      })
      
      console.log('Event listeners set up successfully')
      showToast('Contract debug info logged to console', 'success')
      
    } catch (error) {
      console.error('Contract debug error:', error)
      showToast('Contract debug failed', 'error')
    }
  }

  // Initialize wallet with account
  const initializeWallet = async (userAccount) => {
    try {
      console.log('Initializing wallet for account:', userAccount)
      setAccount(userAccount)
      
      // Check network first
      const isCorrectNetwork = await checkCorrectNetwork()
      if (!isCorrectNetwork) {
        return
      }
      
      // Create provider and contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, vaultABI, signer)
      setContract(contract)
      
      // Debug contract connection
      await debugContract()
      
      // Fetch initial data
      await fetchUserBalance(userAccount)
      await fetchTransactionHistory(userAccount)
      
      // Set up event listeners
      setupEventListeners(contract, userAccount)
      
      console.log('Wallet initialized successfully')
      
    } catch (error) {
      console.error('Error initializing wallet:', error)
      throw error
    }
  }

  // Set up event listeners
  const setupEventListeners = (contractInstance, userAccount) => {
    // Listen for account changes
    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log('Account changed:', accounts)
      const newAccount = accounts[0]
      if (newAccount) {
        setAccount(newAccount)
        await fetchUserBalance(newAccount)
        await fetchTransactionHistory(newAccount)
      } else {
        // User disconnected
        setAccount(null)
        setUserBalance('0')
        setTransactions([])
        localStorage.removeItem('vaultBalance')
      }
    })

    // Listen for network changes
    window.ethereum.on('chainChanged', async (chainId) => {
      console.log('Network changed:', chainId)
      if (chainId !== '0x61') {
        showToast('Please switch to BSC Testnet', 'error')
      } else {
        showToast('Connected to BSC Testnet', 'success')
        // Refresh data after network switch
        if (account) {
          await fetchUserBalance(account)
          await fetchTransactionHistory(account)
        }
      }
    })

    // Listen for new transactions
    contractInstance.on('Deposited', async (user, amount, timestamp) => {
      console.log('Deposit event:', user, amount.toString())
      if (user.toLowerCase() === userAccount.toLowerCase()) {
        await fetchUserBalance(userAccount)
        await fetchTransactionHistory(userAccount)
        showToast('Deposit successful!', 'success')
      }
    })
    
    contractInstance.on('Withdrawn', async (user, amount, timestamp) => {
      console.log('Withdraw event:', user, amount.toString())
      if (user.toLowerCase() === userAccount.toLowerCase()) {
        await fetchUserBalance(userAccount)
        await fetchTransactionHistory(userAccount)
        showToast('Withdrawal successful!', 'success')
      }
    })
  }

  // Helper functions for localStorage
  const getCachedHistory = (account) => {
    try {
      const data = localStorage.getItem(`vaultHistory_${account}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };
  const setCachedHistory = (account, history) => {
    try {
      localStorage.setItem(`vaultHistory_${account}`, JSON.stringify(history));
    } catch {}
  };
  const getCachedBalance = (account) => {
    try {
      const data = localStorage.getItem(`vaultBalance_${account}`);
      return data || '0';
    } catch {
      return '0';
    }
  };
  const setCachedBalance = (account, balance) => {
    try {
      localStorage.setItem(`vaultBalance_${account}`, balance);
    } catch {}
  };

  // Fetch user's balance
  const fetchUserBalance = async (userAccount) => {
    if (!contract || !userAccount) return
    
    try {
      console.log('Fetching balance for:', userAccount)
      setIsLoadingBalance(true)
      const balance = await contract.getBalance(userAccount)
      const formattedBalance = ethers.utils.formatEther(balance)
      console.log('Balance fetched:', formattedBalance)
      setUserBalance(formattedBalance)
      setCachedBalance(userAccount, formattedBalance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Modified fetchTransactionHistory to accept a custom fromBlock and append/prepend
  const fetchTransactionHistory = async (userAccount, customFromBlock = null, prepend = false) => {
    if (!CONTRACT_ADDRESS || !userAccount) {
      console.warn('Cannot fetch transactions: contract address or userAccount missing');
      return;
    }
    let lastError = null;
    for (let i = 0; i < BSC_TESTNET_RPCS.length; i++) {
      try {
        const rpcProvider = new ethers.providers.JsonRpcProvider(BSC_TESTNET_RPCS[i]);
        const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, vaultABI, rpcProvider);
        const currentBlock = await rpcProvider.getBlockNumber();
        let fromBlock = customFromBlock !== null ? customFromBlock : Math.max(0, currentBlock - BLOCK_RANGE);
        let toBlock = customFromBlock !== null ? customFromBlock + BLOCK_RANGE : currentBlock;
        if (customFromBlock !== null) {
          // For loading older history, go backwards
          toBlock = customFromBlock;
          fromBlock = Math.max(0, toBlock - BLOCK_RANGE);
        }
        const depositEvents = await readOnlyContract.queryFilter(
          readOnlyContract.filters.Deposited(userAccount),
          fromBlock,
          toBlock
        );
        const withdrawEvents = await readOnlyContract.queryFilter(
          readOnlyContract.filters.Withdrawn(userAccount),
          fromBlock,
          toBlock
        );
        const newEvents = [
          ...depositEvents.map(event => ({
            type: 'deposit',
            amount: ethers.utils.formatEther(event.args.amount),
            hash: event.transactionHash,
            timestamp: new Date(event.args.timestamp * 1000).toLocaleString(),
            blockNumber: event.blockNumber
          })),
          ...withdrawEvents.map(event => ({
            type: 'withdraw',
            amount: ethers.utils.formatEther(event.args.amount),
            hash: event.transactionHash,
            timestamp: new Date(event.args.timestamp * 1000).toLocaleString(),
            blockNumber: event.blockNumber
          }))
        ].sort((a, b) => b.blockNumber - a.blockNumber);
        let updatedEvents = newEvents;
        if (prepend && transactions.length > 0) {
          // Prepend to existing
          updatedEvents = [...transactions, ...newEvents].sort((a, b) => b.blockNumber - a.blockNumber);
        }
        setTransactions(updatedEvents);
        setCachedHistory(userAccount, updatedEvents);
        // Update the fromBlock for next load more
        setHistoryFromBlock(fromBlock);
        console.log('Total transactions found:', updatedEvents.length);
        return;
      } catch (err) {
        lastError = err;
        console.warn(`RPC endpoint failed: ${BSC_TESTNET_RPCS[i]}`, err);
      }
    }
    // If all endpoints fail
    showToast('Transaction history is temporarily unavailable due to network limits. Please try again later.', 'error');
    console.error('All RPC endpoints failed for transaction history:', lastError);
  }

  // On wallet connect, load cached history and balance
  useEffect(() => {
    if (account) {
      setUserBalance(getCachedBalance(account));
      setTransactions(getCachedHistory(account));
      setHistoryFromBlock(null); // Reset for new account
    }
  }, [account]);

  // On contract/account ready, fetch latest history
  useEffect(() => {
    if (contract && account) {
      fetchTransactionHistory(account);
    }
  }, [contract, account]);

  // Step 6: Refresh Button (ensure contract/account check)
  // In your JSX, update the Refresh button's onClick:
  // <button
  //   onClick={() => {
  //     if (!contract || !account) {
  //       console.warn("Contract or account not ready");
  //       return;
  //     }
  //     fetchTransactionHistory(account);
  //   }}
  // >
  //   Refresh
  // </button>

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      console.log('Attempting to connect wallet...')
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0]
        
        if (account) {
          console.log('Wallet connected successfully:', account)
          await initializeWallet(account)
          setShowConnectPopup(false)
          showToast('Wallet connected successfully!', 'success')
        } else {
          throw new Error('No account selected')
        }
      } else {
        showToast('Please install MetaMask!', 'error')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      // Don't show alert if user cancelled
      if (error.code !== 4001) {
        showToast('Failed to connect wallet. Please try again.', 'error')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle deposit
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }
    
    if (parseFloat(depositAmount) < 0.001) {
      showToast('Minimum deposit is 0.001 BNB', 'error')
      return
    }
    
    try {
      setIsLoading(true)
      const amount = ethers.utils.parseEther(depositAmount)
      console.log('Depositing:', amount.toString())
      const tx = await contract.deposit({ value: amount })
      console.log('Deposit transaction:', tx.hash)
      showToast('Transaction submitted! Waiting for confirmation...', 'success')
      await tx.wait()
      
      // Refresh data after transaction
      await fetchUserBalance(account)
      await fetchTransactionHistory(account)
      
      setDepositAmount('')
      showToast('Deposit successful!', 'success')
    } catch (error) {
      console.error('Deposit error:', error)
      if (error.code === 4001) {
        showToast('Transaction was cancelled', 'error')
      } else {
        showToast('Deposit failed. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }
    
    try {
      setIsLoading(true)
      const amount = ethers.utils.parseEther(withdrawAmount)
      console.log('Withdrawing:', amount.toString())
      const tx = await contract.withdraw(amount)
      console.log('Withdraw transaction:', tx.hash)
      showToast('Transaction submitted! Waiting for confirmation...', 'success')
      await tx.wait()
      
      // Refresh data after transaction
      await fetchUserBalance(account)
      await fetchTransactionHistory(account)
      
      setWithdrawAmount('')
      showToast('Withdrawal successful!', 'success')
    } catch (error) {
      console.error('Withdraw error:', error)
      if (error.code === 4001) {
        showToast('Transaction was cancelled', 'error')
      } else {
        showToast('Withdrawal failed. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      {/* Navbar */}
      <Navbar />
      
      <div className="py-8">
        {/* Header with Connect Wallet Button */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Travel Vault</h1>
            <div className="flex items-center space-x-3">
              {account && (
                <button
                  onClick={debugContract}
                  className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  Debug
                </button>
              )}
              {account && (
                <button
                  onClick={switchToBSC}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  Switch to BSC
                </button>
              )}
              <button
                onClick={() => setShowConnectPopup(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </div>

          {/* Main Content - Two Divs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Transactions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Transactions</h2>
              
              {/* Transaction Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount (BNB)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount to deposit"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={!depositAmount || isLoading || !account}
                    className="mt-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Deposit'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw Amount (BNB)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || isLoading || !account}
                    className="mt-2 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Vault Balance</h2>
              
              {!account ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Connect your wallet to view your vault balance</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Balance */}
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-2">Current Balance</p>
                    {isLoadingBalance ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-blue-800">{userBalance} BNB</p>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Account Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-mono text-sm">{account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Network:</span>
                        <span className="text-green-600">BSC Testnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Transactions:</span>
                        <span className="text-blue-600">{transactions.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDepositAmount('0.1')}
                        className="p-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Quick 0.1 BNB
                      </button>
                      <button
                        onClick={() => setWithdrawAmount(userBalance)}
                        className="p-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Withdraw All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions Section - Centered Below */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                <div className="flex items-center space-x-3">
                  {account && (
                    <div className="text-sm text-gray-500">
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                  )}
                  {account && (
                    <button
                      onClick={() => {
                        if (!contract || !account) {
                          console.warn("Contract or account not ready");
                          return;
                        }
                        fetchTransactionHistory(account);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Refresh
                    </button>
                  )}
                </div>
              </div>
              
              {!account ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Connect your wallet to view transaction history</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                      Debug Info: Contract {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Check browser console for detailed logs
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${tx.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{tx.amount} BNB</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500 font-mono">{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</p>
                          <a 
                            href={`https://testnet.bscscan.com/tx/${tx.hash}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline text-xs"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Load More Button */}
            {account && transactions.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    if (!contract || !account) return;
                    // Load older history from previous fromBlock
                    fetchTransactionHistory(account, historyFromBlock, true);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Connect Wallet Popup */}
      {showConnectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">Connect your MetaMask wallet to access your Travel Vault</p>
              
              <div className="space-y-3">
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
                <button
                  onClick={() => setShowConnectPopup(false)}
                  disabled={isConnecting}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationPage


