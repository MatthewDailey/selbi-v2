require('babel-core/register');

// Usage: node index.js <stage> <tool name> <tool args>
const desiredApp = process.argv[3];
const targetStage = process.argv[2];

if (targetStage !== 'individual'
  && targetStage !== 'develop'
  && targetStage !== 'staging'
  && targetStage !== 'production') {
  throw Error(`${targetStage} is not a valid stage.`);
}

if (targetStage === 'develop'
  || targetStage === 'staging'
  || targetStage === 'production') {
  process.env.SELBI_CONFIG_FILE = 'non-existant-rc-filename';
  process.env.SELBI_ENVIRONMENT = targetStage;
}

require(`./${desiredApp}`);