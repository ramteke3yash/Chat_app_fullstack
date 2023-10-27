const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.signinUser = async (req, res, next) => {
  try {
    // Extract 'name', 'email', 'phone', and 'password' from the request body
    const { name, email, phone, password } = req.body;

    // Check if any of the required parameters are missing or empty
    if (
      !name ||
      name.trim() === "" ||
      !password ||
      password.trim() === "" ||
      !email ||
      email.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Bad parameters. Something is missing" });
    }

    // Check if a user with the same email or phone number already exists in the database
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { phone: phone ? phone : null }, // Only check phone if it's provided
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      } else {
        return res
          .status(409)
          .json({ error: "User with this phone number already exists" });
      }
    }

    // Hash the password securely with bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
      // Create a new user in the database with the provided details
      const data = await User.create({
        name: name,
        email: email,
        phone: phone,
        password: hash,
      });

      // Send a success response upon successful user creation
      res.status(201).json({ message: "Successfully created a new user" });
    });
  } catch (error) {
    // Handle internal server errors and send an error response
    console.error("Add user failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
