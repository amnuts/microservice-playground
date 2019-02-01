const express = require("express");
const graphqlHTTP = require("express-graphql");
const jwt = require("express-jwt");
const cors = require("cors");
const axios = require("axios");
const schema = require("./schema/schema");
const urls = require("./schema/urls");

const app = express();

app.use(cors());
app.options("*", cors());

//
// Setup for JWT and error/route handling
//

app.use(
  jwt({
    secret: process.env.JWT_HASH,
    credentialsRequired: true
  }).unless({
    path: ["/health/ping", "/graphql"]
  })
);

app.use(function(req, res, next) {
  if (
    req.hasOwnProperty("user") &&
    (!req.user.payload.account_id || !req.user.payload.user_id)
  ) {
    res.status(401).send("invalid payload...");
    return;
  }
  next();
});

app.get("/health/ping", (req, res) => {
  let now = Date.now();
  return axios
    .all([
      axios.get(`${urls.accountsHealth}/ping`).catch(function(e) {
        console.log("Error " + e.message);
      }),
      axios.get(`${urls.usersHealth}/ping`).catch(function(e) {
        console.log("Error " + e.message);
      }),
      axios.get(`${urls.projectsHealth}/ping`).catch(function(e) {
        console.log("Error " + e.message);
      }),
      axios.get(`${urls.assetsHealth}/ping`).catch(function(e) {
        console.log("Error " + e.message);
      })
    ])
    .then(
      axios.spread(function(accounts, users, projects, assets) {
        return res.json({
          start: now,
          gateway: Date.now(),
          accounts: accounts.data,
          users: users.data,
          projects: projects.data,
          assets: assets.data
        });
      })
    );
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

//
// Catch-all error handling
//

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (app.get("env") === "local") {
    console.log(err);
  }
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token");
  }
  if (err.name === "MissingRequiredElements") {
    res.status(400).send("missing some required elements");
  }
  res.status(err.status || 500).send();
});

//
// Start the listening
//

let server = app.listen(process.env.SERVICE_PORT, function() {
  console.log(
    `gateway listening on ${server.address().address}:${server.address().port}`
  );
});
