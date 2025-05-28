const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Sign up route
router.post("/signup", userController.signup);

// Login route
router.post("/login", userController.login);

// Get all boards of an user
router.get("/:userId/boards", authMiddleware, userController.getUserBoards);

module.exports = router;
