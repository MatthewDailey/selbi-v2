require('babel-core/register');

// Usage: node index.js <tool name> <tool args>
const desiredApp = process.argv[2];

require(`./${desiredApp}`);