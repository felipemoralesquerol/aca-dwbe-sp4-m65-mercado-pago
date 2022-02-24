require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require("morgan");

app.set('port', process.env.PORT);

// Para poder el body json del request
app.use(express.json());
app.use(morgan('dev'));

// SDK de Mercado Pago
const mercadopago = require('mercadopago');
// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN + " "
});

// Crea un objeto de preferencia

app.post('/crear/pago', async (req, res) => {
  const { title, unit_price, quantity } = req.body;
  let preference = {
    items: [
      {
        title,
        unit_price,
        quantity,
        collector_id: 1
      }
    ]
  };

  mercadopago.preferences.create(preference).
    then(function (response) {
      let { init_point } = response.response;
      res.status(200).json(init_point);
    }).catch(function (error) {
      res.status(500).json(error);
    });
});

app.get('/redirect', async (req, res) => {
  let params = req.query;
  res.status(200).json(params);
});

app.listen(app.get('port'), 'localhost', () => {
  console.log(`Server on port ${app.get('port')}`);
});