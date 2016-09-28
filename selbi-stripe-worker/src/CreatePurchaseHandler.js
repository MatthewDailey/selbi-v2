
function validateData(data) {
  return Promise.resolve();
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
function createCharge(stripe,
                      amountCents,
                      feeCents,
                      description,
                      receiptEmail,
                      customerId,
                      sellerAccountId) {
  console.log('about to create charge');
  return new Promise((resolve, reject) => {
    stripe.charges.create({
      description,
      amount: amountCents,
      currency: 'usd',
      customer: customerId,
      destination: sellerAccountId,
      capture: true, // Means to issue the charge immediately, rather than wait 7 days.
      application_fee: feeCents,
      receipt_email: receiptEmail,
    }, (err, charge) => {
      if (err) {
        reject(err);
      } else {
        resolve(charge);
      }
    });
  });
}

/*
 * This class provides the Firebase-Queue listener which is used to process a payment.
 *
 * Steps:
 * 1) Fetch listing data.
 * 2) Fetch seller merchant account and buyer payment method.
 * 3) Execute payment
 * 4) Record purchases to /users/$uid/purchases/$listingId
 * 5) Mark listing as sold
 * 6) Record sale to /users/$uid/sales/$listingId
 *
 * If there is a failure we write to /users/$uid/purchases/$listingId/status which the user will
 * notify.
 */
class CreatePurchaseHandler {
  constructor(firebaseDatabase, stripe) {
    this.firebaseDb = firebaseDatabase;
    this.stripe = stripe;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb;
    const stripe = this.stripe;
    return (data, progress, resolveCreateAccountTask, rejectCreateAccountTask) => {
      console.log(`Handling purchase of listing:${data.listingId} buyerUid:${data.buyerUid}`);

      const timestamp = Date.now();

      const initializeSaleAndPurchase = (listingData) => {
        console.log('initializing sale and purchase for ', listingData);

        const saleRecord = {
          buyerUid: data.buyerUid,
          sellerUid: listingData.sellerId,
          timestamp,
          status: 'in-progress',
        };

        console.log('sale record: ', saleRecord);

        const buyerPurchaseRef = firebaseDb
          .ref('users')
          .child(data.buyerUid)
          .child('purchases')
          .child(data.listingId);
        const createPurchaseRecord = buyerPurchaseRef.set(saleRecord);

        const sellerSaleRef = firebaseDb
          .ref('users')
          .child(listingData.sellerId)
          .child('sales')
          .child(data.listingId);
        const createSaleRecord = sellerSaleRef.set(saleRecord);

        const loadBuyerData = () => firebaseDb
          .ref('users')
          .child(data.buyerUid)
          .once('value')
          .then((buyerSnapshot) => {
            if (!buyerSnapshot.exists()) {
              console.log('failed to load buyer account data')
              return Promise.reject(`Unable to load buyer ${data.buyerUid} account info.`)
            }
            console.log('loaded buyer account data', buyerSnapshot.val())
            return buyerSnapshot.val();
          });

        const loadSellerData = () => firebaseDb
          .ref('users')
          .child(listingData.sellerId)
          .once('value')
          .then((sellerSnapshot) => {
            if (!sellerSnapshot.exists()) {
              console.log('failed to load seller data')
              return Promise.reject(`Unable to load seller ${listingData.sellerId} account info.`);
            }
            console.log('loaded seller account data', sellerSnapshot.val())
            return sellerSnapshot.val();
          });

        const loadBuyerAndSellerInfo = () => Promise.all([loadBuyerData(), loadSellerData()]);

        const loadSellerMerchantAccount = (sellerStripeKey) => firebaseDb
          .ref('stripeAccount')
          .child(sellerStripeKey)
          .once('value')
          .then((merchantSnapshot) => {
            if (!merchantSnapshot.exists()) {
              console.log('failed to load seller stripe account data')
              return Promise.reject(`Unable to load seller ${listingData.sellerId} stripe account.`)
            }
            console.log('loaded seller stripe account data', merchantSnapshot.val())
            return merchantSnapshot.val();
          });

        const loadBuyerCustomerAccount = (buyerStripeKey) => firebaseDb
          .ref('stripeCustomer')
          .child(buyerStripeKey)
          .once('value')
          .then((buyerSnapshot) => {
            if (!buyerSnapshot.exists()) {
              console.log('failed to laod buyer stripe account')
              return Promise.reject(`Unable to load buyer ${data.buyerUid} stripe account.`)
            }
            console.log('loaded buyer stripe account data', buyerSnapshot.val())
            return buyerSnapshot.val();
          });

        const executeCharge = () => {
          const priceCents = listingData.price * 100;
          const feeCents = priceCents * 0.15;
          const description = listingData.title;

          loadBuyerAndSellerInfo()
            .then((buyerAndSellerInfo) => {
              const buyerInfo = buyerAndSellerInfo[0];
              const sellerInfo = buyerAndSellerInfo[1];

              if (!buyerInfo.payment || buyerInfo.payment.status != 'OK') {
                return Promise.reject('buyer payment is not set up.')
              }

              if (!sellerInfo.merchant || sellerInfo.merchant.status != 'OK') {
                return Promise.reject('seller merchant is not set up.')
              }

              return Promise.all([
                Promise.resolve(buyerInfo),
                loadBuyerCustomerAccount(buyerInfo.payment.stripeCustomerPointer),
                loadSellerMerchantAccount(sellerInfo.merchant.stripeAccountPointer)])
            })
            .then((results) => {
              console.log('Loaded all relevant data for charege', results);
              const buyerData = results[0];
              const buyerCustomerAccount = results[1];
              const sellerMerchantAccount = results[2];
              return createCharge(
                stripe,
                priceCents,
                feeCents,
                description,
                buyerData.email,
                buyerCustomerAccount.id,
                sellerMerchantAccount.id);
            });
        };

        const markListingAsSold = () => Promise.resolve('todo');

        const markChargesSuccessful = () => {
          const updateBuyerOnFailure = buyerPurchaseRef.child('status').set('success');
          const updateSellerOnFailure = sellerSaleRef.child('status').set('success');
          return Promise.all([updateBuyerOnFailure, updateSellerOnFailure]);
        };

        return Promise.all([createPurchaseRecord, createSaleRecord])
          .then(executeCharge)
          .then(markListingAsSold)
          .then(markChargesSuccessful)
          .catch((error) => {
            const errorMessage = `ERROR processing payment. ${error}`;
            console.log(errorMessage)
            rejectCreateAccountTask(errorMessage);
            const updateBuyerOnFailure = buyerPurchaseRef.child('status').set(errorMessage);
            const updateSellerOnFailure = sellerSaleRef.child('status').set(errorMessage);
            return Promise.all([updateBuyerOnFailure, updateSellerOnFailure]);
          });
      };

      return firebaseDb
        .ref('listings')
        .child(data.listingId)
        .once('value')
        .then((listingSnapshot) => {
          if (!listingSnapshot.exists()) {
            return Promise.reject('Listing does not exist.');
          }
          return listingSnapshot.val();
        })
        .then(initializeSaleAndPurchase);
    };
  }
}

module.exports = CreatePurchaseHandler;
