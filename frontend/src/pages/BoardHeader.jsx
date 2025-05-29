import { useState } from "react";
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const BoardHeader = ({ board, onUpdate }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: board.name,
    description: board.description,
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        name: board.name,
        description: board.description,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow">
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full p-2 text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="w-full p-2 text-gray-600 border-b border-gray-300 focus:outline-none focus:border-primary-500"
                rows="2"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
              <button onClick={handleEditToggle} className="ml-2">
                <PencilIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {board.description && (
              <p className="mt-2 text-gray-600">{board.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardHeader;
