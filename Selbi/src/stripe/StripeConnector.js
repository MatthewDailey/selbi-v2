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


/*
 * This method demonstrates how to create Personally Identifying Information token (aka a token
 * which points to a user's SSN). This is passed when creating the Stripe Account for a seller to
 * receive payments.
 *
 * This method is intended to be run in a React Native environment.
 *
 * @param pii The Personally Identifying Information of the user for whom we are creating an
 * account.
 *
 * @returns Promise fulfilled with the PII token response.
 */
export function createPiiToken(pii) {
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    body: `pii[personal_id_number]=${pii}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${config.stripePublicKey}`,
    } })
    .then((res) => res.json())
    .then(logJson('PII Token Response'));
}

/*
 * This method demonstrates how to create a Bank token which can be used to create a Stripe accout
 * to payout sellers.
 *
 * This method is intended to be run in a React Native environment.
 *
 * @param accountHolderName String full name of the account holder.
 * @param rountingNumber Number of the bank rounding number
 * @param accountNumber Number of the bank account number.
 *
 * @returns Promise fulfilled with bank token response.
 */
export function createBankToken(accountHolderName, routingNumber, accountNumber) {
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    body:
    `bank_account[account_holder_name]=\'${accountHolderName}\'&` +
    'bank_account[account_holder_type]=individual&' +
    'bank_account[country]=US&' +
    'bank_account[currency]=usd&' +
    `bank_account[routing_number]=${routingNumber}&` +
    `bank_account[account_number]=${accountNumber}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${config.stripePublicKey}`,
    } })
    .then((res) => res.json())
    .then(logJson('Bank Token Response'));
}