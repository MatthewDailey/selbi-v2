import initializeStripe from 'stripe';

const stripe = initializeStripe(process.env.STRIPE_PRIVATE);

// Received by running clientCreateBankAccount. Should be passed from client.
// Note that each of these can only be used once.
const bankToken = 'ba_18hihQLzdXFwKk7fSpjRi2LJ';
const piiToken = 'pii_18hipLLzdXFwKk7f9BjtVwqV';

stripe.accounts.create({
  managed: true,
  country: 'US',
  legal_entity: {
    dob: {
      day: 20,
      month: 3,
      year: 1990,
    },
    first_name: 'Matt',
    last_name: 'Dailey',
    type: 'individual', // only other option is 'company'
    address: {
      city: 'San Francisco',
      line1: '655 Natoma Street',
      line2: 'Apt C',
      postal_code: '94103',
      state: 'CA',
    },
    ssn_last_4: 4856,
  },
  tos_acceptance: {
    date: Math.floor(Date.now() / 1000),
    ip: '2601:645:8004:1b30:f17f:485a:a74c:1cba' // My apt in SF
  },
}, (err, account) => {
  console.log(err);
  console.log(account);
});



