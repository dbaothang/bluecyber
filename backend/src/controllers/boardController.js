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

exports.getUserBoards = async (req, res) => {
  try {
    // Lấy tất cả boards thuộc về user hiện tại
    const boards = await Board.find({ owner: req.user.userId })
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .select("-__v"); // Loại bỏ trường __v

    res.json(boards);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch boards",
      details: err.message,
    });
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

    const defaultTasks = [
      {
        name: "Task in Progress",
        description: "This is a sample task in progress",
        status: "in-progress",
        board: board._id,
      },
      {
        name: "Task Completed",
        description: "This is a sample completed task",
        status: "completed",
        board: board._id,
      },
      {
        name: "Task Wont Do",
        description: "This is a sample task that wont be done",
        status: "wont-do",
        board: board._id,
      },
    ];

    await Task.insertMany(defaultTasks);

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
    await Board.deleteOne({ _id: board._id });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
