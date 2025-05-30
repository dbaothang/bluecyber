const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all board routes
router.use(authMiddleware);

// Board routes
router.get("/:boardId", boardController.getBoard);
router.post("/", boardController.createBoard);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);
router.get("/", authMiddleware, boardController.getUserBoards);

module.exports = router;
