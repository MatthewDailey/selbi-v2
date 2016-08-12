import initializeStripe from 'stripe';

const stripe = initializeStripe(process.env.STRIPE_PRIVATE);

// Should add shipping info as necessary.
stripe.charges.create({
  description: 'initial test charge',
  amount: 1000,
  currency: 'usd',
  customer: 'cus_8zikijIPjkYqjU',
  destination: 'acct_18hhfyJqbRpOQz1w',
  capture: true, // Means to issue the charge immediately, rather than wait 7 days.
  application_fee: 100,
  receipt_email: 'matthew.j.dailey@gmail.com',
});
