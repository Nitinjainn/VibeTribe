// Node Sync Helper - Explains blockchain node issues to users

export const explainNodeSyncIssue = () => {
  return {
    title: "What are Node Sync Issues?",
    explanation: `
Blockchain nodes sometimes get out of sync with the network. This is common on testnets like BSC Testnet.

**What's happening:**
- The blockchain node you're connected to is missing recent data
- This causes "missing trie node" errors
- It's a temporary issue, not a problem with your account

**What we're doing:**
- Using Firestore membership as a fallback
- Retrying operations automatically
- Providing alternative RPC endpoints

**What you can do:**
- Wait 2-3 minutes and try again
- Use the "Troubleshoot Network" button
- Switch to a different network and back
- Try during off-peak hours

**This is normal for testnets!** Mainnet is much more stable.
    `,
    solutions: [
      "Wait 2-3 minutes and try again",
      "Use the 'Troubleshoot Network' button",
      "Switch networks and back",
      "Try during off-peak hours",
      "Refresh the page"
    ]
  };
};

export const getNodeSyncStatus = async () => {
  // Test multiple RPC endpoints to see which ones are working
  const endpoints = [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'https://data-seed-prebsc-2-s1.binance.org:8545/',
    'https://bsc-testnet.public.blastapi.io',
    'https://bsc-testnet.publicnode.com'
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          endpoint,
          status: 'working',
          blockNumber: data.result
        });
      } else {
        results.push({
          endpoint,
          status: 'failed',
          error: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      results.push({
        endpoint,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  const workingEndpoints = results.filter(r => r.status === 'working');
  const failedEndpoints = results.filter(r => r.status === 'failed');
  
  return {
    workingCount: workingEndpoints.length,
    failedCount: failedEndpoints.length,
    totalCount: endpoints.length,
    workingEndpoints,
    failedEndpoints,
    isHealthy: workingEndpoints.length > 0
  };
};

export const suggestNextSteps = (nodeSyncStatus) => {
  if (nodeSyncStatus.isHealthy) {
    return {
      message: "Some nodes are working fine. Try switching to a different RPC endpoint.",
      action: "troubleshoot"
    };
  } else {
    return {
      message: "All nodes seem to be having issues. This is temporary - try again in a few minutes.",
      action: "wait"
    };
  }
}; 