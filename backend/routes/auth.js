const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refreshToken", authController.refreshToken);
router.post("/forgot-pw", authController.forgotPW);
router.post("/reset-pw", authController.resetPW);

module.exports = router;
