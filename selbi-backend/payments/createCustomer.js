import initializeStripe from 'stripe';

// Customers are used for repeated purchases from the same user.

const stripe = initializeStripe(process.env.STRIPE_PRIVATE);

stripe.customers.create({
  description: 'Customer for matthew.thompson@example.com',
  source: 'tok_18hiwdLzdXFwKk7fdWfIsvrL', // One-time token created from clientCreateCreditCard.js
}, (err, customer) => {
  console.log(err);
  console.log(customer);
});
