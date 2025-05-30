import { useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const BoardHeader = ({ board, onUpdate }) => {
  const { logout, user } = useAuth();
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
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 space-y-3">
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full p-2 text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="w-full p-2 text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                rows="1"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600 flex items-center"
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-3 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600 flex items-center"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {board.name}
                </h1>
                <button
                  onClick={handleEditToggle}
                  className="ml-3 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              {board.description && (
                <p className="mt-1 text-gray-600">{board.description}</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
