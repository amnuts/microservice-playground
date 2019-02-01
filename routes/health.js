const router = require("express").Router();

router.get("/health/ping", (req, res, next) => {
  return res.json({
    pong: Date.now()
  });
});

module.exports = router;
