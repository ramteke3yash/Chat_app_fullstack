const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const secretKey = process.env.SECRETKEY;

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

exports.generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, secretKey);
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Checking if the user with the provided email exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Comparing the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = exports.generateAccessToken(user.id);
      res.status(200).json({
        message: "User login successful",
        token: token,
      });
    } else {
      res.status(401).json({ error: "User not authorized" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
