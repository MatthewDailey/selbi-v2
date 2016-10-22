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
  console.log('SENDING EMAIL----------------------------');
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
      console.log('SEND EMAIL RESULT----------------------------');
      console.log('Result:', result);
      console.log('Error:', error);
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
