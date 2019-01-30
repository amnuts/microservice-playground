'use strict';

const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');

const app = express();
const routesHealth = require('./routes/health');
const routesCrud = require(`./routes/${process.env.SERVICE_NAME}`);

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//
// Setup for JWT and error/route handling
//

app.use(jwt({
  secret: process.env.JWT_HASH,
  credentialsRequired: true
}).unless({
  path: routesHealth.stack.map(function(l) {
    return l.route.path;
  })
}));

app.use(function (req, res, next) {
  if (req.hasOwnProperty('user')  && (!req.user.payload.account_id || !req.user.payload.user_id)) {
    res.status(401).send('invalid payload...');
    return;
  }
  next();
});

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

app.listen(process.env.SERVICE_PORT, function () {
  console.log(`${process.env.SERVICE_NAME} service listening on port ${process.env.SERVICE_PORT}!`);
});
