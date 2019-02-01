var jwt = require("jsonwebtoken");

console.log(
  "curl -H 'Authorization: Bearer " +
    jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        payload: {
          account_id: 1,
          user_id: 2
        }
      },
      process.env.JWT_HASH
    ) +
    `' -H "Content-Type: application/json" -i localhost:${
      process.env.SERVICE_PORT
    }/${process.env.SERVICE_NAME}`
);
