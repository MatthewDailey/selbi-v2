import fetch from 'node-fetch';

fetch('https://api.stripe.com/v1/tokens', {
  method: 'POST',
  body: 'pii[personal_id_number]=000000000',
  headers: {
    Authorization: 'Bearer pk_test_jgbSMlxI62OBXiWH1ENa9o5U',
  },
})
.then((res) => res.json())
.then((body) => {
  console.log(body);
});

