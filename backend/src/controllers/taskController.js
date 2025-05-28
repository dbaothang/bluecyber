const Task = require("../models/Task");
const Board = require("../models/Board");

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { name, description, icon, status } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user owns the board that this task belongs to
    const board = await Board.findById(task.board);
    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    task.name = name || task.name;
    task.description = description || task.description;
    task.icon = icon || task.icon;
    task.status = status || task.status;
    task.updatedAt = new Date();

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user owns the board that this task belongs to
    const board = await Board.findById(task.board);
    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await task.remove();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, description, icon, status } = req.body;

    // Check if the board exists and the user owns it
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const task = new Task({
      name: name || "New Task",
      description: description || "",
      icon: icon || "📝",
      status: status || "in-progress",
      board: boardId,
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
