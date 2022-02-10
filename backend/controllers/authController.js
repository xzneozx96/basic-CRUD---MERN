const sendEmail = require("../utils/sendEmail");

const accountsDB = {
  users: require("../database/accounts.json"),
  setAccounts: function (data) {
    this.users = data;
  },
};

const resetPwRecordsDB = {
  records: require("../database/resetPW.json"),
  setRecords: function (data) {
    this.records = data;
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
      .status(400)
      .json({ msg: "Username and password are required !", success: false });

  // check for duplicate users in the db
  const duplicate = accountsDB.users.find(
    (person) => person.username === username
  );

  if (duplicate)
    return res.status(409).json({ success: false, msg: "Duplicated Username" }); // conflic status code

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

    res
      .sendStatus(201)
      .json({ success: true, msg: "New account has been created" });
  } catch (err) {
    res.sendStatus(500).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Username and password are required !" });

  // check if the entered username exists
  const found_user = accountsDB.users.find(
    (person) => person.username === username
  );

  if (!found_user)
    return res.status(401).json({ success: false, msg: "Account not found" }); // 401: Unauthorized server code

  // evaluate password
  const is_pw_matched = await bcrypt.compare(password, found_user.password);
  if (is_pw_matched) {
    // generate access and refresh token
    const access_token = jwt.sign(
      {
        username: found_user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
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
      secure: true,
      sameSite: "None",
      maxAage: 24 * 60 * 60 * 1000, // equal to 1 day in milliseconds
    });

    // send back to client the success message and the access_token
    res.json({ access_token });
  } else {
    res.status(401).json({ success: false, msg: "Incorrect Password !" });
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

  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

  res.sendStatus(204);
};

const refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({
      msg: "You are not allowed to perform this action",
      success: false,
    }); // Unauthorized

  const refresh_token = cookies.jwt;

  // check if the user who is sending refresh_token request exists
  const found_user = accountsDB.users.find(
    (person) => person.refresh_token === refresh_token
  );

  if (!found_user)
    return res.status(403).json({
      msg: "You are not allowed to perform this action",
      success: false,
    }); // Forbidden

  // evaluate refresh_token
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded_jwt) => {
      if (err || found_user.username !== decoded_jwt.username)
        return res
          .status(403)
          .json({ msg: "Refresh Token has expired", success: false });

      // once the refresh_token has been verified, send back a new access_token
      const new_access_token = jwt.sign(
        { username: decoded_jwt.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      // send back the new access token to client
      res.json({ access_token: new_access_token });
    }
  );
};

const forgotPW = (req, res) => {
  const { email, username } = req.body;

  // check if username is in the db
  const found_user = accountsDB.users.find(
    (person) => person.username === username
  );

  // username doesn't exist
  if (!found_user)
    return res.status(404).json({ success: false, msg: "Username not found" });

  // username exists => save a record for reset-pw then send reset link to user via email
  // actually send email
  sendEmail({ email, user_id: found_user.id }, res);
};

const resetPW = (req, res) => {
  const { user_id, reset_token, new_pw } = req.body;

  // check if there is a resetPW record of the user with id === user_id
  const found_record = resetPwRecordsDB.records.find(
    (record) => record.user_id === user_id
  );

  // record doesn't exist
  if (!found_record)
    res.status(403).json({
      success: false,
      msg: "You are not allowed to perform this action !",
    });

  // record does exist
  // 1. check if the token has expired
  jwt.verify(
    reset_token,
    process.env.RESET_PW_SECRET,
    async (err, decoded_token) => {
      try {
        // reset_token has expired
        if (err) {
          // delete the reset-pw record in the db
          const other_records = resetPwRecordsDB.records.filter(
            (record) => record.user_id !== user_id
          );

          resetPwRecordsDB.setRecords([...other_records]);

          await fsPromises.writeFile(
            path.join(__dirname, "..", "database", "resetPW.json"),
            JSON.stringify(resetPwRecordsDB.records)
          );

          // notify user
          return res.status(403).json({
            msg: "Verification Link has expired!",
          });
        }

        // reset_token is still valid => hash the new pw then update accounts db
        // hash new pw
        const new_hashed_pw = await bcrypt.hash(new_pw, 10);

        // update db
        const updated_accounts = accountsDB.users.map((account) => {
          if (account.id === user_id) {
            return { ...account, password: new_hashed_pw };
          }
          return account;
        });

        accountsDB.setAccounts([...updated_accounts]);

        await fsPromises.writeFile(
          path.join(__dirname, "..", "database", "accounts.json"),
          JSON.stringify(accountsDB.users)
        );

        // send back success message
        res.status(200).json({
          success: true,
          msg: "You password has been reset",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          msg: "Internal Server Error ! Record Deletion Falied !",
        });
      }
    }
  );
};

module.exports = { register, login, refreshToken, logout, forgotPW, resetPW };
