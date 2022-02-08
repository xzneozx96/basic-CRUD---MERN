const usersData = require("../database/users.json");
const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");

const getAllUsers = (req, res) => {
  fs.readFile(
    path.join(__dirname, "..", "database", "users.json"),
    "utf-8",
    (err, jsonString) => {
      if (err) {
        return res.status(500).json({ msg: "Internal Server Error" });
      }

      try {
        const all_users = JSON.parse(jsonString);
        return res.json(all_users);
      } catch (err) {
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  );
};

const getSingleUser = (req, res) => {
  const { id } = req.params;

  const matched_user = usersData.find((user) => user.id === id);

  if (!matched_user) return res.status(404).json({ msg: "User not found" });

  return res.json(matched_user);
};

const createNewUser = async (req, res) => {
  const { id, name, email, age, phone_number, date_of_birth } = req.body;

  // check if name, email, phone_number is duplicated
  const duplicated_name = usersData.find((user) => user.name === name);

  const duplicated_email = usersData.find((user) => user.email === email);

  const duplicated_phone = usersData.find(
    (user) => user.phone_number === phone_number
  );

  if (duplicated_name)
    return res.json({ success: false, msg: "Username has been used" });

  if (duplicated_email)
    return res.json({ success: false, msg: "Email has been used" });

  if (duplicated_phone)
    return res.json({ success: false, msg: "Phone number has been used" });

  const new_user = { id, name, email, age, phone_number, date_of_birth };

  const updated_users = [new_user, ...usersData];

  await fsPromises.writeFile(
    path.join(__dirname, "..", "database", "users.json"),
    JSON.stringify(updated_users)
  );
  return res.json({ success: true, msg: "New user has been created" });
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const { name, email, age, phone_number, date_of_birth } = req.body;

  // check if the on updated user exists
  const on_updated_user = usersData.find((user) => user.id === id);

  // if not, send back not found response
  if (!on_updated_user) return res.status(404).json({ msg: "User not found" });

  // if it does exists, update the database
  const updated_users = usersData.map((user) => {
    if (user.id === id) {
      return { ...user, name, email, age, phone_number, date_of_birth };
    }

    return user;
  });

  // update database
  await fsPromises.writeFile(
    path.join(__dirname, "..", "database", "users.json"),
    JSON.stringify(updated_users)
  );

  return res.json({ msg: "User has been updated" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  // check if the selected user exists
  const on_deleted_user = usersData.find((user) => user.id === id);

  // if not, send back not found response
  if (!on_deleted_user) return res.status(404).json({ msg: "User not found" });

  // if it does exists, update the database
  const updated_users = usersData.filter((user) => user.id !== id);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "database", "users.json"),
    JSON.stringify(updated_users)
  );

  return res.json({ msg: "User has been deleted" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createNewUser,
  updateUser,
  deleteUser,
};
