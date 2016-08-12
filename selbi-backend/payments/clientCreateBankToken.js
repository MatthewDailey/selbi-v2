import fetch from 'node-fetch';

fetch('https://api.stripe.com/v1/tokens', {
  method: 'POST',
  body:
    'bank_account[account_holder_name]=\'Matt Dailey\'&' +
    'bank_account[account_holder_type]=individual&' +
    'bank_account[country]=US&' +
    'bank_account[currency]=usd&' +
    'bank_account[routing_number]=110000000&' +
    'bank_account[account_number]=000123456789',
  headers: {
    Authorization: 'Bearer pk_test_jgbSMlxI62OBXiWH1ENa9o5U',
  },
})
.then((res) => {
  return res.json();
}).then((body) => {
  console.log(body);
});

