
const config = {
  stripePrivateKey: 'sk_test_MtXKfDYlQdtIYHTunUaw8cu4',
};

if (process.env.SELBI_ENVIRONMENT === 'production') {
  config.stripePrivateKey = 'sk_live_KVe2yZ8aAJCqaOGo17dVVEWA';
}

export default config;
