const express = require("express");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../models/user.model");

const userRouter = express.Router();    // User router instance

// Register
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Check if the user with the given email already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(200).json({ msg: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const userData = await UserModel.findOne({ email });

    if (!userData) {
      return res.status(404).json({ msg: "Wrong credentials" });
    }

    // Compare passwords
    bcrypt.compare(password, userData.password, function (err, result) {
      if (result) {
        // Generate a token on successful login
        const token = jwt.sign(
          { name: userData.name, userID: userData._id },
          process.env.JWT_SECRET_KEY
        );

        // Send the response with the token and user information
        return res.status(200).json({
          msg: "Login successful",
          token,
          username: userData.name,
          userID: userData._id,
          role: userData.role,
          email: userData.email,
        });
      } else {
        return res.status(400).json({ msg: "Wrong credentials" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = userRouter;