
const config = {
  // This is the Nearprinter key.
  stripePrivateKey: 'sk_test_RHjBCVkeOHrGiRQiZdViICm5',
};

if (process.env.SELBI_ENVIRONMENT === 'production') {
  config.stripePrivateKey = 'sk_live_DrssBizr5Ce5JIFJpydhACCA';
}

export default config;
