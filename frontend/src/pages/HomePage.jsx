import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import api from "../api";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Nếu user đã có boards, chuyển đến board đầu tiên
      if (user.boards && user.boards.length > 0) {
        navigate(`/board/${user.boards[0]._id}`);
      } else {
        // Nếu không có board, tạo mới
        api.post("/api/boards").then((response) => {
          navigate(`/board/${response.data._id}`);
        });
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Task Board
        </h1>
        <p className="text-gray-600">Please sign in or sign up to continue</p>
      </div>
    </div>
  );
};

export default HomePage;
