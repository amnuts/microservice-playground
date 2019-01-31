'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
const routesHealth = require('./routes/health');
const routesCrud = require(`./routes/${process.env.SERVICE_NAME}`);

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//
// Base routes
//

app.use('/', routesHealth);
app.use(`/${process.env.SERVICE_NAME}`, routesCrud);

//
// Catch-all error handling
//

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (app.get('env') === 'local') {
    console.log(err);
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
  if (err.name === 'MissingRequiredElements') {
    res.status(400).send('missing some required elements');
  }
  res.status(err.status || 500).send();
});

//
// Set up the server to listen
//

let server = app.listen(process.env.SERVICE_PORT, function () {
  console.log(`${process.env.SERVICE_NAME} service listening on  ${server.address().address}:${server.address().port}!`);
});
