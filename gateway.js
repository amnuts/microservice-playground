const express = require("express");
const graphqlHTTP = require("express-graphql");
const { createGraphQlSchema } = require("oasgraph");
const jwt = require("express-jwt");
const cors = require("cors");
const axios = require("axios");
const urls = require("./schema/urls");
const { mergeSpecifications } = require("./utils/merge-json");

let specAccounts = require("./schema/accounts.json");
let specUsers = require("./schema/users.json");
let specProjects = require("./schema/projects.json");
let specAssets = require("./schema/assets.json");

let mergedSpec = mergeSpecifications(specAccounts, specUsers, specProjects, specAssets);

async function main(spec) {
    const { schema, report } = await createGraphQlSchema(spec);
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
                        gateway: { pong: Date.now() },
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
      next(new Error("NotFound"));
    });

    app.use(function(err, req, res, next) {
        if (app.get("env") === "local") {
            console.log(err);
        }
        let errRes = {
            name: err.name,
            code: 1,
            message: ""
        };
        if (err.name === "NotFound") {
            res.status(404).json({
                name: err.name,
                code: 404,
                message: "Resource not found"
            });
        }
        if (err.name === "UnauthorizedError") {
            res.status(401).json({
                name: err.name,
                code: 401,
                message: "Unauthorized access"
            });
        }
        if (err.name === "MissingRequiredElements") {
            res.status(400).json({
                name: err.name,
                code: 400,
                message: "missing some required elements"
            });
        }
        res.status(err.status || 500).json({
            name: err.name,
            code: err.status || 500,
            message: "Something went wrong"
        });
    });

    //
    // Start the listening
    //

    let server = app.listen(process.env.SERVICE_PORT, function() {
        console.log(
            `gateway listening on ${server.address().address}:${server.address().port}`
        );
    });
};

main(mergedSpec);
