import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.send({
    status: 'OK',
    service: 'web',
  });
});

app.get('/privacy', (req, res) => {
  res.render('privacyPolicy', { title: 'Privacy Policy' });
});

app.listen(8080);

