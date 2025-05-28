const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Task routes
router.post("/:boardId", taskController.createTask);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
