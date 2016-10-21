import GeoFire from 'geofire';

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

function changeListingStatusToSold(firebaseDb, listingId) {
  const newStatus = 'sold';
  // Start by loading the existing snapshot and verifying it exists.
  return firebaseDb
    .ref('listings')
    .child(listingId)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Update status on /listing data.
        return firebaseDb
          .ref('listings')
          .child(listingId)
          .update({
            status: newStatus,
          })
          .then(() => Promise.resolve(snapshot));
      }
      throw new Error('No such listing exists while trying to change listing status.');
    })
    .then((oldSnapshot) => {
      const allUpdatePromises = [];

      allUpdatePromises.push(firebaseDb
        .ref('/userListings')
        .child(oldSnapshot.val().sellerId)
        .child(oldSnapshot.val().status)
        .child(listingId)
        .remove());

      allUpdatePromises.push(firebaseDb
        .ref('/userListings')
        .child(oldSnapshot.val().sellerId)
        .child(newStatus)
        .child(listingId)
        .set(true));

      allUpdatePromises.push(new GeoFire(firebaseDb.ref('/geolistings'))
        .remove(listingId));

      return Promise.all(allUpdatePromises)
        .then(() => Promise.resolve(oldSnapshot));
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
 * 6) send notification to seller
 * 7) Record sale to /users/$uid/sales/$listingId
 *
 * If there is a failure we write to /users/$uid/purchases/$listingId/status which the user will
 * notify.
 */
class CreatePurchaseHandler {
  constructor(firebaseDatabase, stripe, sendNotification) {
    this.firebaseDb = firebaseDatabase;
    this.stripe = stripe;
    this.sendNotification = sendNotification;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb;
    const stripe = this.stripe;
    const sendNotification = this.sendNotification;
    return (data, progress, resolvePurchaseTask, rejectPurchaseTask) => {
      console.log(`Handling purchase of listing:${data.listingId} buyerUid:${data.buyerUid}`);

      const timestamp = Date.now();

      const executeListingPurchase = (listingData) => {
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
              console.log('failed to load buyer account data');
              return Promise.reject(`Unable to load buyer ${data.buyerUid} account info.`)
            }
            console.log('loaded buyer account data', buyerSnapshot.val());
            return buyerSnapshot.val();
          });

        const loadSellerData = () => firebaseDb
          .ref('users')
          .child(listingData.sellerId)
          .once('value')
          .then((sellerSnapshot) => {
            if (!sellerSnapshot.exists()) {
              console.log('failed to load seller data');
              return Promise.reject(`Unable to load seller ${listingData.sellerId} account info.`);
            }
            console.log('loaded seller account data', sellerSnapshot.val());
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
              console.log('failed to laod buyer stripe account');
              return Promise.reject(`Unable to load buyer ${data.buyerUid} stripe account.`);
            }
            console.log('loaded buyer stripe account data', buyerSnapshot.val());
            return buyerSnapshot.val();
          });

        const executeCharge = () => {
          const priceCents = Math.floor(listingData.price * 100);
          const feeCents = Math.ceil(priceCents * 0.15);
          const description = listingData.title;

          return loadBuyerAndSellerInfo()
            .then((buyerAndSellerInfo) => {
              const buyerInfo = buyerAndSellerInfo[0];
              const sellerInfo = buyerAndSellerInfo[1];

              if (!buyerInfo.payment || buyerInfo.payment.status !== 'OK') {
                return Promise.reject('buyer payment is not set up.');
              }

              if (!sellerInfo.merchant || sellerInfo.merchant.status !== 'OK') {
                return Promise.reject('seller merchant is not set up.');
              }

              return Promise.all([
                Promise.resolve(buyerInfo),
                Promise.resolve(sellerInfo),
                loadBuyerCustomerAccount(buyerInfo.payment.stripeCustomerPointer),
                loadSellerMerchantAccount(sellerInfo.merchant.stripeAccountPointer)]);
            })
            .then((results) => {
              const buyerData = results[0];
              const sellerData = results[1];
              const buyerCustomerAccount = results[2];
              const sellerMerchantAccount = results[3];
              return createCharge(
                stripe,
                priceCents,
                feeCents,
                description,
                buyerData.email,
                buyerCustomerAccount.id,
                sellerMerchantAccount.id)
                .then(() => {
                  return Promise.resolve({
                    listingData,
                    buyerData,
                    sellerData,
                    priceCents,
                    feeCents,
                  });
                });
            });
        };

        const markListingAsSold = (priorResult) => {
          return changeListingStatusToSold(firebaseDb, data.listingId)
            .then(() => Promise.resolve(priorResult));
        };

        const markChargesSuccessful = (priorResult) => {
          resolvePurchaseTask();
          const updateBuyerOnFailure = buyerPurchaseRef.child('status').set('success');
          const updateSellerOnFailure = sellerSaleRef.child('status').set('success');
          return Promise.all([updateBuyerOnFailure, updateSellerOnFailure])
            .then(() => Promise.resolve(priorResult));
        };

        const sendSellerNotification = (executeChargeResult) => {
          return firebaseDb
            .ref('userPublicData')
            .child(data.buyerUid)
            .once('value')
            .then((buyerPublicInfoSnapshot) => {
              if (buyerPublicInfoSnapshot.exists()) {
                return Promise.resolve(buyerPublicInfoSnapshot.val());
              }
              return Promise.resolve({});
            })
            .then((buyerPublicInfo) => {
              return firebaseDb
                .ref('userBulletins')
                .child(executeChargeResult.listingData.sellerId)
                .push()
                .set({
                  type: 'purchase',
                  timestamp: new Date().getTime(),
                  status: 'unread',
                  payload: {
                    buyerDisplayName: buyerPublicInfo.displayName,
                    listingTitle: executeChargeResult.listingData.title,
                    priceCents: executeChargeResult.priceCents,
                    feeCents: executeChargeResult.feeCents,
                  },
                })
                .then(() => buyerPublicInfo);
            })
            .then((buyerPublicInfo) => sendNotification(
              executeChargeResult.sellerData.fcmToken,
              '🤑🤑🤑 Your listing was purchased!', // Emoji inline.
              `${buyerPublicInfo.displayName} bought your listing `
                + `${executeChargeResult.listingData.title} for `
                + `$${parseFloat(executeChargeResult.priceCents / 100).toFixed(2)}.`
            ));
        };

        return Promise.all([createPurchaseRecord, createSaleRecord])
          .then(executeCharge)
          .then(markListingAsSold)
          .then(markChargesSuccessful)
          .catch((error) => {
            const errorMessage = `ERROR processing payment. ${error}`;
            console.log(errorMessage);
            rejectPurchaseTask(errorMessage);
            const updateBuyerOnFailure = buyerPurchaseRef.child('status').set(errorMessage);
            const updateSellerOnFailure = sellerSaleRef.child('status').set(errorMessage);
            return Promise.all([updateBuyerOnFailure, updateSellerOnFailure]);
          })
          .then(sendSellerNotification);
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
        .then(executeListingPurchase);
    };
  }
}

module.exports = CreatePurchaseHandler;
