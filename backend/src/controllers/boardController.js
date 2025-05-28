const Board = require("../models/Board");
const Task = require("../models/Task");

// Get a board by ID
exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if the user owns the board
    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get all tasks for this board
    const tasks = await Task.find({ board: board._id });

    res.json({ board, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;

    const board = new Board({
      name: name || "My Task Board",
      description: description || "",
      owner: req.user.userId,
    });

    await board.save();

    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a board
exports.updateBoard = async (req, res) => {
  try {
    const { name, description } = req.body;

    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if the user owns the board
    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    board.name = name || board.name;
    board.description = description || board.description;
    board.updatedAt = new Date();

    await board.save();

    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if the user owns the board
    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete all tasks associated with this board
    await Task.deleteMany({ board: board._id });

    // Delete the board
    await board.remove();

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
