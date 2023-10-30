const express = require("express");

const User = require("../models/userModel");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.post("/add-user", userController.signinUser);
router.post("/login", userController.loginUser);

module.exports = router;
