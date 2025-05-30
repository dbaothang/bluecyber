import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";
import BoardHeader from "./BoardHeader";
import TaskColumn from "./TaskColumn";
import { useAuth } from "../providers/AuthProvider";
import BoardsSidebar from "./../components/BoardsSidebar";

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
        localStorage.setItem("lastVisitedBoardId", boardId);
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

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post(`/api/tasks/${boardId}`, taskData);
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

  const handleBoardSelect = (newBoardId) => {
    setLoading(true);
    setBoard(null);
    setTasks([]);
    navigate(`/board/${newBoardId}`);
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
    { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
    { id: "completed", title: "Completed", color: "bg-green-100" },
    { id: "wont-do", title: "Wont Do", color: "bg-gray-100" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <BoardsSidebar
        currentBoardId={boardId}
        onBoardSelect={handleBoardSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoardHeader board={board} onUpdate={handleUpdateBoard} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {statusColumns.map((column) => (
                <TaskColumn
                  key={column.id}
                  title={column.title}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  status={column.id}
                  color={column.color}
                  onCreateTask={(taskData) =>
                    handleCreateTask({
                      ...taskData,
                      board: boardId,
                      status: column.id,
                    })
                  }
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
