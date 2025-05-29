import { useState } from "react";
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import TaskItem from "./TaskItem";

const TaskColumn = ({
  title,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    name: "",
    description: "",
    icon: "📝",
    status: title.toLowerCase().replace(" ", "-"),
  });

  const defaultTaskNames = {
    "in-progress": "Task In Progress",
    completed: "Task Completed",
    "wont-do": "Task Won't Do",
  };

  const handleAddTask = () => {
    onCreateTask({
      name: defaultTaskNames[editTaskData.status] || "New Task",
      description: editTaskData.description,
      icon: editTaskData.icon,
      status: editTaskData.status,
    });
    resetForm();
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
    onUpdateTask(taskId, editTaskData);
    setEditingTaskId(null);
  };

  const resetForm = () => {
    setEditTaskData({
      name: "",
      description: "",
      icon: "📝",
      status: title.toLowerCase().replace(" ", "-"),
    });
    setIsAddingTask(false);
  };

  const handleChange = (e) => {
    setEditTaskData({
      ...editTaskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (status) => {
    setEditTaskData({
      ...editTaskData,
      status,
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
          <div key={task._id} className="p-3 border border-gray-200 rounded-lg">
            {editingTaskId === task._id ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <select
                    name="icon"
                    value={editTaskData.icon}
                    onChange={handleChange}
                    className="w-16 p-1 text-center border rounded"
                  >
                    <option value="📝">📝 Note</option>
                    <option value="🔧">🔧 Fix</option>
                    <option value="✨">✨ Feature</option>
                    <option value="🐞">🐞 Bug</option>
                    <option value="🚀">🚀 Improve</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    value={editTaskData.name}
                    onChange={handleChange}
                    placeholder="Task name"
                    className="flex-1 p-1 border rounded"
                  />
                </div>

                <textarea
                  name="description"
                  value={editTaskData.description}
                  onChange={handleChange}
                  placeholder="Enter a short description"
                  className="w-full p-2 text-sm border rounded"
                  rows="3"
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex flex-col space-y-2">
                    {["in-progress", "completed", "wont-do"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name="status"
                          checked={editTaskData.status === status}
                          onChange={() => handleStatusChange(status)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">
                          {status.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

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
                      onClick={() => setEditingTaskId(null)}
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
              <TaskItem
                task={task}
                onEdit={() => handleEditStart(task)}
                onDelete={() => onDeleteTask(task._id)}
              />
            )}
          </div>
        ))}
      </div>

      {isAddingTask ? (
        <div className="p-4 mt-3 border border-gray-200 rounded-lg">
          <h3 className="mb-3 font-medium">Task details</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Task name
              </label>
              <input
                type="text"
                name="name"
                value={
                  editTaskData.name ||
                  defaultTaskNames[editTaskData.status] ||
                  "New Task"
                }
                onChange={handleChange}
                className="w-full p-2 font-semibold border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={editTaskData.description}
                onChange={handleChange}
                placeholder="Enter a short description"
                className="w-full p-2 text-sm border rounded"
                rows="2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Icon</label>
              <select
                name="icon"
                value={editTaskData.icon}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="📝">📝 Note</option>
                <option value="🔧">🔧 Fix</option>
                <option value="✨">✨ Feature</option>
                <option value="🐞">🐞 Bug</option>
                <option value="🚀">🚀 Improve</option>
              </select>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium">Status</p>
              <div className="flex flex-col space-y-2">
                {["in-progress", "completed", "wont-do"].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      checked={editTaskData.status === status}
                      onChange={() => handleStatusChange(status)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={resetForm}
                className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded bg-red-400 hover:bg-red-500"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Save
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
