const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting VibeTribe Backend Server...');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating a template...');
  const envTemplate = `# Backend Environment Variables
# Replace with your actual private key
PRIVATE_KEY=your_private_key_here
ALCHEMY_API_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NETWORK=bscTestnet
`;
  fs.writeFileSync(envPath, envTemplate);
  console.log('📝 Created .env template. Please update with your private key.');
}

// Start the server
const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n🛑 Server stopped with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
}); 