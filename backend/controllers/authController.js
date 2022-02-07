const accountsDB = {
  users: require("../database/accounts.json"),
  setAccounts: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .sendStatus(400)
      .json({ msg: "Username and password are required !" });

  // check for duplicate users in the db
  const duplicate = accountsDB.users.find(
    (person) => person.username === username
  );

  if (duplicate)
    return res.sendStatus(409).json({ msg: "Duplicated Username" }); // conflic status code

  try {
    // encrypt the password
    const hashed_pw = await bcrypt.hash(password, 10);

    // store the new user
    const new_user = { username: username, password: hashed_pw };
    accountsDB.setAccounts([...accountsDB.users, new_user]);

    // write to json file (local mock database)
    await fsPromises.writeFile(
      path.join(__dirname, "..", "database", "accounts.json"),
      JSON.stringify(accountsDB.users)
    );

    res.sendStatus(201).json({ msg: "New account has been created" });
  } catch (err) {
    res.sendStatus(500).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .sendStatus(400)
      .json({ msg: "Username and password are required !" });

  // check if the entered username exists
  const found_user = accountsDB.users.find(
    (person) => person.username === username
  );

  if (!found_user)
    return res.sendStatus(401).json({ msg: "Account not found" }); // 401: Unauthorized server code

  // evaluate password
  const is_pw_matched = await bcrypt.compare(password, found_user.password);
  if (is_pw_matched) {
    // generate access and refresh token
    const access_token = jwt.sign(
      {
        username: found_user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refresh_token = jwt.sign(
      {
        username: found_user.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // save refresh_token of the recently logged-in user to database
    const logged_in_user = { ...found_user, refresh_token };

    // update database
    const other_users = accountsDB.users.filter(
      (person) => person.username !== found_user.username
    );
    accountsDB.setAccounts([...other_users, logged_in_user]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "database", "accounts.json"),
      JSON.stringify(accountsDB.users)
    );

    // send back to client the refresh_token securely via "httpOnly" which is not available to javascript - cookies must be sent right before the json in order to succeed
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      maxAage: 24 * 60 * 60 * 1000, // equal to 1 day in milliseconds
    });

    // send back to client the success message and the access_token
    res.json({ access_token });
  } else {
    res.sendStatus(401).json({ msg: "Invalid Password !" });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // Success request but no content sent back

  const refresh_token = cookies.jwt;

  // check if the refresh_token is in the database.
  const found_user = accountsDB.users.find(
    (person) => person.refresh_token === refresh_token
  );

  // If it does NOT exists but we do have a cookie, clear the cookie.
  if (!found_user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  // If it does exists, delete the refresh_token in the database and clear the cookie as well
  const other_users = accountsDB.users.filter(
    (person) => person.refresh_token !== found_user.refresh_token
  );

  const on_log_out_user = { ...found_user, refreshToken: "" };

  // update the database
  accountsDB.setAccounts([...other_users, on_log_out_user]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "database", "accounts.json"),
    JSON.stringify(accountsDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true });

  res.sendStatus(204);
};

const refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refresh_token = cookies.jwt;

  // check if the user who is sending refresh_token request exists
  const found_user = accountsDB.users.find(
    (person) => person.refresh_token === refresh_token
  );

  if (!found_user)
    return res
      .sendStatus(403)
      .json({ msg: "You are not allowed to perform this action" }); // Forbidden

  // evaluate refresh_token
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded_jwt) => {
      if (err || found_user.username !== decoded_jwt.username)
        return res
          .sendStatus(403)
          .json({ msg: "You are not allowed to perform this action" });

      // once the refresh_token has been verified, send back a new access_token
      const new_access_token = jwt.sign(
        { username: decoded_jwt.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // send back the new access token to client
      res.json({ access_token: new_access_token });
    }
  );
};

module.exports = { register, login, refreshToken, logout };
