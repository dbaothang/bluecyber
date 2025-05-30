import { useState } from "react";
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

const TaskColumn = ({
  title,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const columnStatus = title.toLowerCase().replace(" ", "-");

  // State for new task
  const [newTaskData, setNewTaskData] = useState({
    name: "",
    description: "",
    icon: "📝",
    status: columnStatus,
  });

  // State for editing task, initialized when edit starts
  const [editTaskData, setEditTaskData] = useState(null);

  const defaultTaskNames = {
    "in-progress": "Task In Progress",
    completed: "Task Completed",
    "wont-do": "Task Wont Do",
  };

  const handleAddTask = () => {
    const taskData = {
      name: newTaskData.name.trim() || defaultTaskNames[columnStatus] || "",
      description: newTaskData.description.trim(),
      icon: newTaskData.icon,
      status: columnStatus,
    };
    console.log(taskData);

    onCreateTask(taskData); // Truyền cả object data

    // Reset form
    setNewTaskData({
      name: "",
      description: "",
      icon: "📝",
      status: columnStatus,
    });
    setIsAddingTask(false);
  };

  const handleEditStart = (task) => {
    setEditingTaskId(task._id);
    setEditTaskData({
      name: task.name,
      description: task.description || "",
      icon: task.icon || "📝",
      status: task.status,
    });
  };

  const handleSave = (taskId) => {
    if (!editTaskData) return; // Thêm kiểm tra này

    onUpdateTask(taskId, {
      name:
        editTaskData.name.trim() ||
        defaultTaskNames[editTaskData.status] ||
        "New Task",
      description: editTaskData.description.trim(),
      icon: editTaskData.icon,
      status: editTaskData.status,
    });
    console.log("trolll");

    setEditingTaskId(null);
    setEditTaskData(null); // Reset về null sau khi save
  };

  const resetNewTaskForm = () => {
    setNewTaskData({
      name: "",
      description: "",
      icon: "📝",
      status: columnStatus,
    });
    setIsAddingTask(false);
  };

  const handleNewTaskChange = (e) => {
    setNewTaskData({
      ...newTaskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditTaskChange = (e) => {
    if (!editTaskData) return;
    setEditTaskData({
      ...editTaskData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-3 border border-gray-200 rounded-lg group"
          >
            {editingTaskId === task._id ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{editTaskData?.icon}</span>
                  <input
                    type="text"
                    name="name"
                    value={editTaskData?.name || ""}
                    onChange={handleEditTaskChange}
                    placeholder={defaultTaskNames[task.status] || "New Task"}
                    className="flex-1 p-1 border rounded"
                  />
                </div>

                <textarea
                  name="description"
                  value={editTaskData?.description || ""}
                  onChange={handleEditTaskChange}
                  placeholder="Enter a short description"
                  className="w-full p-2 text-sm border rounded"
                  rows="3"
                />

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditTaskData(null);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(task._id)}
                      className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">{task.icon}</span>
                    <p className="font-medium">{task.name}</p>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1 pl-7">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEditStart(task)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAddingTask ? (
        <div className="p-4 mt-3 border border-gray-200 rounded-lg">
          <h3 className="mb-3 font-medium">New Task Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Task name (leave empty for default)
              </label>
              <input
                type="text"
                name="name"
                value={newTaskData.name}
                onChange={handleNewTaskChange}
                placeholder={`Default: ${
                  defaultTaskNames[columnStatus] || "New Task"
                }`}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={newTaskData.description}
                onChange={handleNewTaskChange}
                placeholder="Enter description"
                className="w-full p-2 text-sm border rounded"
                rows="2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Icon</label>
              <select
                name="icon"
                value={newTaskData.icon}
                onChange={handleNewTaskChange}
                className="w-full p-2 border rounded"
              >
                <option value="📝">📝 Note</option>
                <option value="🔧">🔧 Fix</option>
                <option value="✨">✨ Feature</option>
                <option value="🐞">🐞 Bug</option>
                <option value="🚀">🚀 Improve</option>
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={resetNewTaskForm}
                className="flex items-center px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Create Task
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center justify-center w-full p-2 mt-3 text-sm text-gray-600 border border-dashed rounded-lg hover:bg-gray-50 hover:text-gray-800"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add new task
        </button>
      )}
    </div>
  );
};

export default TaskColumn;
