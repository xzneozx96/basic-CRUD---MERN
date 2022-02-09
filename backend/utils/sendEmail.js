const fsPromises = require("fs").promises;
const path = require("path");

// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const resetPwRecordsDB = {
  records: require("../database/resetPW.json"),
  setRecords: function (data) {
    this.records = data;
  },
};

const updateResetPwDB = async ({ user_id, email, reset_pw_token }) => {
  try {
    // delete old record (there will be duplicated records in case user re-reset the password)
    const old_record = resetPwRecordsDB.records.find(
      (record) => record.user_id === user_id
    );

    if (old_record) {
      const other_records = resetPwRecordsDB.records.filter(
        (record) => record.user_id !== user_id
      );

      resetPwRecordsDB.setRecords([...other_records]);

      await fsPromises.writeFile(
        path.join(__dirname, "..", "database", "resetPW.json"),
        JSON.stringify(resetPwRecordsDB.records)
      );
    }

    // save new record
    const new_resetPw_record = {
      user_id,
      email,
      reset_pw_token,
    };

    resetPwRecordsDB.setRecords([
      ...resetPwRecordsDB.records,
      new_resetPw_record,
    ]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "database", "resetPW.json"),
      JSON.stringify(resetPwRecordsDB.records)
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const sendEmail = async ({ user_id, email }, res) => {
  try {
    // generate a reset token
    const reset_pw_token = jwt.sign(
      {
        user_id,
        email,
      },
      process.env.RESET_PW_SECRET,
      { expiresIn: "10m" }
    );

    const reset_link =
      process.env.FRONT_END_DOMAIN +
      "reset-pw/" +
      user_id +
      "/" +
      reset_pw_token;

    // update reset password records in the db
    updateResetPwDB({ user_id, email, reset_pw_token });

    // send the link back to client

    return res.status(200).json({
      success: true,
      reset_link,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = sendEmail;
