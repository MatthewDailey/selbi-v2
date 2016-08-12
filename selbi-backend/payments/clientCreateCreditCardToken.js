import fetch from 'node-fetch';

fetch('https://api.stripe.com/v1/tokens', {
  method: 'POST',
  body:
  'card[number]=4242424242424242&' +
  'card[exp_month]=12&' +
  'card[exp_year]=2017&' +
  'card[cvc]=123&',
  headers: {
    Authorization: 'Bearer pk_test_jgbSMlxI62OBXiWH1ENa9o5U',
  },
})
.then((res) => res.json())
.then((body) => {
  console.log(body);
});

