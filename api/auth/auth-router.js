const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../../config/secrets.js");

const router = require("express").Router();

const Users = require("../../users/users-model.js");

router.post("/register", async (req, res, next) => {
  const credentials = req.body;

  try {
    if (credentials) {
      const rounds = process.env.BCRYPT_ROUNDS;
      const hash = bcryptjs.hashSync(credentials.password, rounds);
      credentials.password = hash;

      const user = await Users.add(credentials);
      res.status(201).json({ data: user });
    } else {
      next({ errCode: 401, errMessage: "You are not authorized" });
    }
  } catch (err) {
    console.log(err);
    next({ errCode: 500, errMessage: "Error registering new user", ...err });
  }
});
/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!req.body) {
      next({ errCode: 400, errMessage: "Missing username or password" });
    } else {
      const [user] = await Users.findBy({ username: username });
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "Welcome", token: token });
      } else {
        next({ errCode: 401, errMessage: "Invalid credentials" });
      }
    }
  } catch (error) {
    console.log(error);
    next({ errCode: 500, errMessage: "Database error logging in", ...error });
  }
});
/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}

module.exports = router;
