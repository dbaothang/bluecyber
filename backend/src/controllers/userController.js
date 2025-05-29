const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Board = require("../models/Board");
const { createDefaultBoard } = require("../utils/boardUtils");

// Sign up a new user
exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "password must equal to confirmPassword" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Create default board for the user
    const board = await createDefaultBoard(user._id);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ token, userId: user._id, email: user.email, boardId: board._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, userId: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBoards = async (req, res) => {
  try {
    if (req.params.userId != req.user.userId) {
      return res.status(403).json({ error: "Unauthorizaton" });
    }
    const boards = await Board.find({ owner: req.user.userId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
