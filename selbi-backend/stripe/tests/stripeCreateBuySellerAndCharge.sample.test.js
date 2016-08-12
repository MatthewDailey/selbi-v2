import { expect } from 'chai';
import initializeStripe from 'stripe';
import fetch from 'node-fetch';

/*
 * This test simulates creating 2 users (a buy and a seller) and then creating a charge between
 * them using the Stripe Connect API.
 *
 * In practice, these methods will be driven by events triggered by passing data to firebase.
 * However, in this example, we do not want to over complicate things so we simple pass data
 * directly. This demonstrates the modularity of the payment code.
 *
 * This all runs in a NodeJS environment but uses the node-fetch library to simulate a React Native
 * client environment. Methods whose name is suffixed '_deviceSide' are intended to run on a
 * mobile device with React Native.
 *
 * The code will not be fully portable because React Native does not have a concept of environment
 * variables. That part will have to be reimplemented.
 */

const stripe = initializeStripe(process.env.STRIPE_PRIVATE);

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
function createPaymentSource_deviceSide(cardNumber,
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
      Authorization: `Bearer ${process.env.STRIPE_PUBLIC}`,
    } })
    .then((res) => res.json())
    .then(logJson('Credit Card Token Response'))
}

/*
 * This method demonstrates how to create a Customer which can be used for repeated payments. It
 * is intended to be run server side.
 *
 * @param paymentSourceToken String token returned to the client device from Stripe when a payment
 * source was created.
 * @param customerDescription String describing the customer.
 *
 * @returns Promise fulfilled with client data.
 */
function createCustomer(paymentSourceToken, customerDescription) {
  return new Promise((resolve, reject) => {
    stripe.customers.create({
      description: customerDescription,
      source: paymentSourceToken,
    }, (err, customer) => {
      if (err) {
        reject(err);
      } else {
        resolve(customer);
      }
    });
  }).then(logJson('Create Customer Response'));
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
function createPiiToken_deviceSide(pii) {
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    body: `pii[personal_id_number]=${pii}`,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_PUBLIC}`,
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
function createBankToken_deviceSide(accountHolderName, routingNumber, accountNumber) {
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
      Authorization: `Bearer ${process.env.STRIPE_PUBLIC}`,
    } })
    .then((res) => res.json())
    .then(logJson('Bank Token Response'));
}

/*
 * This method demonstrates how to create a Stripe Account for a seller to receive payments.
 *
 * This is intended to be run server side.
 *
 * @param piiTokenId String token representing PII. Passed from client device.
 * @param bankTokenId String token representing bank account. Passed from client device.
 * @param addressBlob Object with line1, line2, city, postal_code, state strings.
 * @param dobBlock Object with day, month, year numbers.
 * @param firstName Bank account owner first name.
 * @param lastName Bank account owner last name.
 * @param tosAcceptanceData Number of epoch at which terms of service was accepted.
 * @param tosAccpetanceId String ip at which terms of service was accepted.
 *
 * @returns Promise fulfilled with account data.
 */
function createAccount(piiTokenId,
                       bankTokenId,
                       addressBlob,
                       dobBlob,
                       firstName,
                       lastName,
                       tosAcceptanceDate,
                       tosAcceptanceIp,
                       userEmail) {
  return new Promise((resolve, reject) => {
    stripe.accounts.create({
      external_account: bankTokenId,
      email: userEmail,
      managed: true,
      country: 'US',
      legal_entity: {
        dob: dobBlob,
        first_name: firstName,
        last_name: lastName,
        type: 'individual', // only other option is 'company'
        address: addressBlob,
        personal_id_number: piiTokenId,
      },
      tos_acceptance: {
        date: tosAcceptanceDate,
        ip: tosAcceptanceIp,
      },
    }, (err, account) => {
      if (err) {
        reject(err);
      } else {
        resolve(account);
      }
    });
  }).then(logJson('Create Account Response'));
}

/*
 * This method demonstrates how to create a charge from a customer to a seller on the Stripe
 * Connect API.
 *
 * This is intended to be run server side. CustomerId, AccountId will both be invisible to users.
 *
 * @param amountCents Number of cents to charge.
 * @param feeCents Number of cents which will be deducted from the charge as a fee.
 * @param customerId String id of the customer who will be charged.
 * @param selledAccountId String id of the seller Account which will receive the funds.
 *
 * @returns Promise fulfilled with charge response.
 */
function createCharge(amountCents, feeCents, customerId, sellerAccountId) {
  return new Promise((resolve, reject) => {
    stripe.charges.create({
      description: 'initial test charge',
      amount: amountCents,
      currency: 'usd',
      customer: customerId,
      destination: sellerAccountId,
      capture: true, // Means to issue the charge immediately, rather than wait 7 days.
      application_fee: feeCents,
      receipt_email: 'matthew.j.dailey@gmail.com',
    }, (err, charge) => {
      if (err) {
        reject(err);
      } else {
        resolve(charge);
      }
    });
  }).then(logJson('Create Charge Response'));
}

describe('Stripe Accounts', () => {
  it('Can create buyer, seller and charge.', function (done) {
    this.timeout(20000);

    const creditCardPromise = createPaymentSource_deviceSide(4242424242424242, 12, 2017, 123);
    const piiPromise = createPiiToken_deviceSide('000000000');
    const bankPromise = createBankToken_deviceSide('Matt Dailey', '110000000', '000123456789');

    Promise.all([creditCardPromise, piiPromise, bankPromise])
      .then((results) => {
        // These would normally be passed to the backend server via Firebase events.
        const creditCardResult = results[0];
        const piiResult = results[1];
        const bankResult = results[2];

        const createAccountPromise = createAccount(
          piiResult.id,
          bankResult.id,
          { city: 'San Francisco',
            line1: '655 Natoma Street',
            line2: 'Apt C',
            postal_code: '94103',
            state: 'CA' },
          { day: 20,
            month: 3,
            year: 1990 },
          'TestFirstName',
          'TestLastName',
          Math.floor(Date.now() / 1000), // tos acceptance date
          '2601:645:8004:1b30:f17f:485a:a74c:1cba',
          'matthew.j.dailey@gmail.com'); // My apt in SF ipv6.

        const createCustomerPromise = createCustomer(
          creditCardResult.id,
          `Automated test user, run at ${Date.now()}`);

        return Promise.all([createAccountPromise, createCustomerPromise]);
      })
      .then((accountAndCustomerResults) => {
        const account = accountAndCustomerResults[0];
        const customer = accountAndCustomerResults[1];

        return createCharge(
          1000, // $10
          100, // $1
          customer.id,
          account.id);
      })
      .then((chargeResult) => {
        expect(chargeResult.amount).to.equal(1000);
        expect(chargeResult.object).to.equal('charge');
        expect(chargeResult.captured).to.equal(true);
        done();
      })
      .catch(done);
  });
});
