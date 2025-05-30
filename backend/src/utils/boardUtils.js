const Board = require("../models/Board");
const Task = require("../models/Task");

// Create a default board with sample tasks for a new user
exports.createDefaultBoard = async (userId) => {
  try {
    // Create the board
    const board = new Board({
      name: "My Task Board",
      description: "Welcome to your new task board!",
      owner: userId,
    });

    await board.save();

    // Create default tasks
    const defaultTasks = [
      {
        name: "Task in Progress",
        description: "This is a sample task in progress",
        icon: "🚧",
        status: "in-progress",
        board: board._id,
      },
      {
        name: "Task Completed",
        description: "This is a sample completed task",
        icon: "✅",
        status: "completed",
        board: board._id,
      },
      {
        name: "Task Wont Do",
        description: "This is a sample task that wont be done",
        icon: "❌",
        status: "wont-do",
        board: board._id,
      },
    ];

    await Task.insertMany(defaultTasks);

    return board;
  } catch (err) {
    console.error("Error creating default board:", err);
    throw err;
  }
};
