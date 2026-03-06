const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ==========================
// 🔹 REGISTER NEW USER
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});


// ==========================
// 🔹 LOGIN USER
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      "mysecretkey",   // replace with process.env.JWT_SECRET if using env
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;