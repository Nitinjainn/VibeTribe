// RPC Utilities for handling BSC Testnet connection issues

const BSC_TESTNET_RPC_URLS = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://bsc-testnet.public.blastapi.io',
  'https://bsc-testnet.publicnode.com',
  'https://bsc-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3'
];

export const testRpcEndpoints = async () => {
  const results = [];
  
  for (const url of BSC_TESTNET_RPC_URLS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          url,
          status: 'success',
          blockNumber: data.result
        });
      } else {
        results.push({
          url,
          status: 'failed',
          error: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      results.push({
        url,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  return results;
};

export const getBestRpcEndpoint = async () => {
  const results = await testRpcEndpoints();
  const workingEndpoints = results.filter(r => r.status === 'success');
  
  if (workingEndpoints.length === 0) {
    throw new Error('No working RPC endpoints found');
  }
  
  // Return the first working endpoint
  return workingEndpoints[0].url;
};

export const addBscTestnetToMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x61', // 97 in hex
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'tBNB',
            decimals: 18,
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error adding BSC Testnet:', error);
    return false;
  }
};

export const switchToBscTestnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }], // BSC Testnet chain ID
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      return await addBscTestnetToMetaMask();
    }
    throw switchError;
  }
};

export const checkNetworkConnection = async () => {
  if (!window.ethereum) {
    return { connected: false, error: 'MetaMask not installed' };
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    return {
      connected: true,
      chainId,
      isBscTestnet: chainId === '0x61',
      hasAccount: accounts.length > 0,
      account: accounts[0] || null
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}; 