const router = require("express").Router();
const _ = require("lodash");
const helpers = require("../helpers");

let mockData = require(`../mock/${process.env.SERVICE_NAME}-data.js`);

router
  .get("/:accountId", (req, res, next) => {
    return res.json(
      _.filter(mockData, { account_id: parseInt(req.params.accountId) })
    );
  })
  .get("/:accountId/:userId", (req, res, next) => {
    return res.json(
      _.find(mockData, {
        id: parseInt(req.params.userId),
        account_id: parseInt(req.params.accountId)
      })
    );
  })
  .post("/:accountId", (req, res, next) => {
    if (!helpers.hasAllProps(["firstName", "lastName"], req.body)) {
      throw new Error("MissingRequiredElements");
    }
    let data = {
      id: _.findLast(mockData).id + 1,
      account_id: parseInt(req.params.accountId),
      added: new Date(),
      modified: null,
      first_name: req.body.firstName,
      last_name: req.body.lastName
    };
    mockData.push(data);
    return res.json(data);
  })
  .patch("/:accountId/:userId", (req, res, next) => {
    if (!helpers.hasAnyProps(["firstName", "lastName"], req.body)) {
      throw new Error("MissingRequiredElements");
    }
    let data = _.find(mockData, {
      id: parseInt(req.params.userId),
      account_id: parseInt(req.params.accountId)
    });
    if (data) {
      if (req.body.hasOwnProperty("firstName")) {
        data.first_name = req.body.firstName;
      }
      if (req.body.hasOwnProperty("lastName")) {
        data.last_name = req.body.lastName;
      }
      data.modified = new Date();
      return res.json(data);
    }
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

module.exports = router;
