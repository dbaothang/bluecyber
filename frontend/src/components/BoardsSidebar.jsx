import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const BoardsSidebar = ({
  currentBoardId,
  onBoardSelect,
  isMobileSidebarOpen,
  toggleMobileSidebar,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardData, setNewBoardData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/api/boards");
        setBoards(response.data);
      } catch (err) {
        toast.error("Failed to fetch boards");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  const handleCreateBoard = async () => {
    if (!newBoardData.name.trim()) {
      toast.error("Board name cannot be empty");
      return;
    }

    try {
      const response = await api.post("/api/boards", {
        name: newBoardData.name,
        description: newBoardData.description,
      });

      setBoards([response.data, ...boards]);
      setNewBoardData({ name: "", description: "" });
      setIsCreating(false);

      localStorage.setItem("lastVisitedBoardId", response.data._id);
      navigate(`/board/${response.data._id}`);
      if (onBoardSelect) onBoardSelect(response.data._id);
      if (toggleMobileSidebar) toggleMobileSidebar();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create board");
      console.error(err);
    }
  };

  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation(); // Prevent triggering board selection

    // Kiểm tra nếu đây là board cuối cùng
    if (boards.length <= 1) {
      toast.error("Bạn không thể xóa board cuối cùng");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this board and all its tasks?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/boards/${boardId}`);

      // Remove the deleted board from state
      setBoards(boards.filter((board) => board._id !== boardId));

      toast.success("Board deleted successfully");

      // If the deleted board was the current one, navigate to the first available board or home
      if (currentBoardId === boardId) {
        if (boards.length > 1) {
          const otherBoard = boards.find((board) => board._id !== boardId);
          if (otherBoard) {
            handleSelectBoard(otherBoard._id);
          }
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete board");
      console.error(err);
    }
  };

  const handleSelectBoard = (boardId) => {
    localStorage.setItem("lastVisitedBoardId", boardId);
    if (onBoardSelect) onBoardSelect(boardId);
    navigate(`/board/${boardId}`);
    if (toggleMobileSidebar) toggleMobileSidebar();
  };

  const handleInputChange = (e) => {
    setNewBoardData({
      ...newBoardData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      {toggleMobileSidebar && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed z-20 left-4 top-4 p-2 rounded-md bg-gray-800 text-white lg:hidden"
        >
          {isMobileSidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`w-64 h-screen bg-gray-800 text-white flex flex-col border-r border-gray-700 fixed lg:static z-10 transition-all duration-300 ease-in-out ${
          toggleMobileSidebar
            ? isMobileSidebarOpen
              ? "left-0"
              : "-left-64"
            : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">My Boards</h2>
          {toggleMobileSidebar && (
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1 rounded hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Create Board Section */}
        <div className="p-4 border-b border-gray-700">
          {isCreating ? (
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={newBoardData.name}
                onChange={handleInputChange}
                placeholder="Board name"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              />
              <textarea
                name="description"
                value={newBoardData.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Create Board
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewBoardData({ name: "", description: "" });
                  }}
                  className="px-3 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Board
            </button>
          )}
        </div>

        {/* Boards List */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              Loading boards...
            </div>
          ) : boards.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No boards yet</div>
          ) : (
            boards.map((board) => (
              <div
                key={board._id}
                onClick={() => handleSelectBoard(board._id)}
                className={`p-3 cursor-pointer hover:bg-gray-700 flex justify-between items-center transition-colors ${
                  currentBoardId === board._id
                    ? "bg-gray-700 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{board.name}</h3>
                  {board.description && (
                    <p className="text-sm text-gray-400 truncate">
                      {board.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  {currentBoardId === board._id && (
                    <ChevronRightIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mx-2" />
                  )}
                  <button
                    onClick={(e) => handleDeleteBoard(board._id, e)}
                    className="p-1 rounded hover:bg-gray-600 text-gray-300 hover:text-red-400"
                    title="Delete board"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700 text-sm">
          <div className="font-medium">{user?.name}</div>
          <div className="text-gray-400">{user?.email}</div>
        </div>
      </div>
    </>
  );
};

export default BoardsSidebar;
