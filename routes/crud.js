const router = require("express").Router();

router
  .get("/", (req, res, next) => {
    return res.json({
      action: "get one"
    });
  })
  .get("/:id", (req, res, next) => {
    return res.json({
      action: "get one"
    });
  })
  .post("/", (req, res, next) => {
    return res.json({
      action: "add one"
    });
  })
  .patch("/:id", (req, res, next) => {
    return res.json({
      action: "update one"
    });
  })
  .delete("/", (req, res, next) => {
    return res.json({
      action: "delete all"
    });
  })
  .delete("/:id", (req, res, next) => {
    return res.json({
      action: "delete one"
    });
  });

module.exports = router;
