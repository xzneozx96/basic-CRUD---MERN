const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;

// middlewares registration
const verifyJWT = require("./middleware/verifyJWT");

// cross origin resource sharing
app.use(cors());

// built-in middleware to handle url-encoded data - also called form data so to say
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data submitted via the url
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes registration
app.use("/auth", require("./routes/auth"));

app.use(verifyJWT);
app.use("/users", require("./routes/users"));

app.listen(PORT, () => console.log("Server is running on port: 3500"));
