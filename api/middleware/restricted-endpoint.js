const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";

    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          next({ errCode: 401, errMessage: "Invalid credentials" });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      next({ errCode: 401, errMessage: "Invalid credentials" });
    }
  } catch (err) {
    next({ errCode: 500, errMessage: "Server error validating credentials" });
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
