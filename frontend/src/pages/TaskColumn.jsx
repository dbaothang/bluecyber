import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  // XIcon,
} from "@heroicons/react/24/solid";
import TaskItem from "./TaskItem";

const TaskColumn = ({
  title,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onCreateTask({
        name: newTaskName.trim(),
        status: title.toLowerCase().replace(" ", "-"),
      });
      setNewTaskName("");
      setIsAddingTask(false);
    }
  };

  const handleEditStart = (task) => {
    setEditingTaskId(task._id);
    setEditTaskData({
      name: task.name,
      description: task.description,
      icon: task.icon,
    });
  };

  const handleEditSave = (taskId) => {
    onUpdateTask(taskId, editTaskData);
    setEditingTaskId(null);
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const handleEditChange = (e) => {
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
          <div key={task._id} className="p-3 border border-gray-200 rounded-lg">
            {editingTaskId === task._id ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="icon"
                    value={editTaskData.icon}
                    onChange={handleEditChange}
                    className="w-10 p-1 text-center border rounded"
                    maxLength="2"
                  />
                  <input
                    type="text"
                    name="name"
                    value={editTaskData.name}
                    onChange={handleEditChange}
                    className="flex-1 p-1 border rounded"
                  />
                </div>
                <textarea
                  name="description"
                  value={editTaskData.description}
                  onChange={handleEditChange}
                  className="w-full p-1 text-sm border rounded"
                  rows="2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditSave(task._id)}
                    className="p-1 text-green-500 hover:text-green-600"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
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
        <div className="mt-3">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Enter task name"
            className="w-full p-2 border rounded"
            autoFocus
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={handleAddTask}
              className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingTask(false)}
              className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Cancel
            </button>
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
