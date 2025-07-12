const fs = require('fs');
const path = require('path');

// ✅ Path from backend/scripts/copyAbis.js → artifacts file
const source = path.resolve(__dirname, '../artifacts/contracts/VibeTribe.sol/VibeTribe.json');

// ✅ Path to frontend's abis folder
const destination = path.resolve(__dirname, '../../frontend/src/abis/VibeTribe.json');

fs.mkdirSync(path.dirname(destination), { recursive: true });

try {
  fs.copyFileSync(source, destination);
  console.log('✅ ABI copied to frontend/src/abis/VibeTribe.json');
} catch (err) {
  console.error('❌ Failed to copy ABI:', err.message);
}
