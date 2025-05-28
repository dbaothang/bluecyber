import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";
import BoardHeader from "./BoardHeader.jsx";
import TaskColumn from "./TaskColumn";
import { useAuth } from "../providers/AuthProvider";

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await api.get(`/api/boards/${boardId}`);
        setBoard(response.data.board);
        setTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching board:", err);
        if (err.response?.status === 401) {
          logout();
        } else {
          toast.error("Failed to load board");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, navigate, logout]);

  const handleUpdateBoard = async (updatedData) => {
    try {
      const response = await api.put(`/api/boards/${boardId}`, updatedData);
      setBoard(response.data);
      toast.success("Board updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update board");
    }
  };

  const handleCreateTask = async (status) => {
    try {
      const response = await api.post(`/api/tasks/${boardId}`, {
        status,
      });
      setTasks([...tasks, response.data]);
      toast.success("Task created successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await api.put(`/api/tasks/${taskId}`, updatedData);
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task))
      );
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-600">
          Loading board...
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-600">Board not found</div>
      </div>
    );
  }

  const statusColumns = [
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
    { id: "wont-do", title: "Won't Do" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <BoardHeader board={board} onUpdate={handleUpdateBoard} />

      <div className="container px-4 mx-auto mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statusColumns.map((column) => (
            <TaskColumn
              key={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              onCreateTask={() => handleCreateTask(column.id)}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
