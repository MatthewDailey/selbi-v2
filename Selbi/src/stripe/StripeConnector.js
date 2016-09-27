import config from '../../config';

export default undefined;

// See this post on using Stripe with React Native.

function logJson(title) {
  return (data) => {
    console.log(`================${title}================`)
    console.log(data);
    return Promise.resolve(data);
  };
}

/*
 * This method demonstrates how to create a payment source which can later be used to create a
 * Customer which can be used for repeated payment.
 *
 * This method is intended to be run in a React Native environment.
 *
 * @param cardNumber The credit card number to associate with customer.
 * @param cardExpMonth The month the credit card will expire.
 * @param cardExpYear The year the credit card will expire.
 * @param cardCvc The cvc for the credit card.
 *
 * @returns Promise filfilled with payment source token response.
 */
export function createPaymentSource(cardNumber,
                                    cardExpMonth,
                                    cardExpYear,
                                    cardCvc) {
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    body:
    `card[number]=${cardNumber}&` +
    `card[exp_month]=${cardExpMonth}&` +
    `card[exp_year]=${cardExpYear}&` +
    `card[cvc]=${cardCvc}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${config.stripePublicKey}`,
    },
  })
  .then((res) => res.json())
  .then(logJson('Credit Card Token Response'));
}
