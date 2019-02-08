const router = require("express").Router();
const _ = require("lodash");
const uuid = require("uuid");
const helpers = require("../helpers");

let mockData = require(`../mock/${process.env.SERVICE_NAME}-data.js`);

router
  .get("/:accountId", (req, res, next) => {
    return res.json(
      _.filter(mockData, { account_id: parseInt(req.params.accountId) })
    );
  })
  .get("/:accountId/:assetId", (req, res, next) => {
    return res.json(
      _.find(mockData, {
        id: req.params.assetId,
        account_id: parseInt(req.params.accountId)
      })
    );
  })
  .post("/:accountId", (req, res, next) => {
    if (!helpers.hasAllProps(["userId", "projectId", "filename"], req.body)) {
      throw new Error("MissingRequiredElements");
    }
    let data = {
      id: uuid.v4(),
      account_id: parseInt(req.params.accountId),
      user_id: parseInt(req.body.userId),
      project_id: req.body.projectId,
      added: new Date(),
      modified: null,
      filename: req.body.filename
    };
    mockData.push(data);
    return res.json(data);
  })
  .patch("/:accountId/:assetId", (req, res, next) => {
    if (!helpers.hasAnyProps(["projectId", "filename"], req.body)) {
      throw new Error("MissingRequiredElements");
    }
    let data = _.find(mockData, {
      id: req.params.assetId,
      account_id: parseInt(req.params.accountId)
    });
    if (data) {
      if (req.body.hasOwnProperty("projectId")) {
        data.project_id = req.body.projectId;
      }
      if (req.body.hasOwnProperty("filename")) {
        data.filename = req.body.filename;
      }
      data.modified = new Date();
      return res.json(data);
    }
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

module.exports = router;
