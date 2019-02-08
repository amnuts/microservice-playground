const router = require("express").Router();
const _ = require("lodash");

let mockData = require(`../mock/${process.env.SERVICE_NAME}-data.js`);

router
  .get("/", (req, res, next) => {
    return res.json(mockData);
  })
  .get("/:accountId", (req, res, next) => {
    return res.json(_.find(mockData, { id: parseInt(req.params.accountId) }));
  })
  .post("/", (req, res, next) => {
    if (req.body.company == "") {
      throw new Error("MissingRequiredElements");
    }
    let data = {
      id: _.findLast(mockData).id + 1,
      added: new Date(),
      modified: null,
      company: req.body.company
    };
    mockData.push(data);
    return res.json(data);
  })
  .patch("/:accountId", (req, res, next) => {
    if (req.body.company == "") {
      throw new Error("MissingRequiredElements");
    }
    let data = _.find(mockData, { id: parseInt(req.params.accountId) });
    if (data) {
      data.company = req.body.company;
      data.modified = new Date();
      return res.json(data);
    }
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

module.exports = router;
