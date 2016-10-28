import Sendinblue from 'sendinblue-api';

const emailClient = new Sendinblue({ apiKey: 'djac5b8nLq3W7ZNR' });

export default undefined;

export function sendItemSoldEmail(sellerEmail,
                                  sellerBankName,
                                  buyerDisplayName,
                                  listingTitle,
                                  priceCents,
                                  feeCents) {
  const payoutCents = priceCents - feeCents;
  return new Promise((resolve, reject) => {
    emailClient.send_transactional_template({
      id: 13, // item sold transactional template id
      to: sellerEmail,
      attr: {
        PRICE: parseFloat(priceCents / 100).toFixed(2),
        FEE: parseFloat(feeCents / 100).toFixed(2),
        PAYOUT: parseFloat(payoutCents / 100).toFixed(2),
        BUYER: buyerDisplayName,
        TITLE: listingTitle,
        BANK_NAME: sellerBankName,
      },
    }, (error, result) => {
      if (error) {
        console.log(`Failed to send ${sellerEmail} about purchase of ${listingTitle}.`
          + ` ${result.message}`);
        reject(result.message);
      } else {
        resolve();
      }
    });
  });
}

export function sendFlaggedInappropriateContentEmail(sellerId,
                                                     sellerData,
                                                     listingUrl,
                                                     listingId,
                                                     listingData,
                                                     reporterId) {
  return new Promise((resolve, reject) => {
    emailClient.send_transactional_template({
      id: 14, // flagged content transactional template id
      to: 'matt@selbi.io',
      attr: {
        SELLER_ID: sellerId,
        SELLER_DATA: JSON.stringify(sellerData),
        LISTING_ID: listingId,
        LISTING_DATA: JSON.stringify(listingData),
        LISTING_URL: listingUrl,
        REPORTER_ID: reporterId,
      },
    }, (error, result) => {
      if (error) {
        console.log(`Failed to send email about flagged content. Listing id: ${listingId}`
            + ` reporterId: ${reporterId} Error Message: ${result.message}`);
        reject(result.message);
      } else {
        resolve();
      }
    });
  });
}

