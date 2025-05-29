import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import api from "../api";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Nếu có token nhưng chưa có user info (trường hợp refresh trang)
          if (!user) {
            // Có thể thêm logic fetch user info ở đây nếu cần
            return;
          }

          // Kiểm tra xem có boardId trong localStorage không (board đã xem gần nhất)
          const lastVisitedBoardId = localStorage.getItem("lastVisitedBoardId");

          if (lastVisitedBoardId) {
            // Chuyển hướng đến board đã xem gần nhất
            navigate(`/board/${lastVisitedBoardId}`);
            return;
          }

          // Nếu không có lastVisitedBoardId, kiểm tra boards của user
          if (user.boards && user.boards.length > 0) {
            // Lưu board đầu tiên vào localStorage và chuyển hướng
            localStorage.setItem("lastVisitedBoardId", user.boards[0]._id);
            navigate(`/board/${user.boards[0]._id}`);
          } else {
            // Nếu user chưa có board nào, tạo board mới
            const response = await api.post("/api/boards");
            localStorage.setItem("lastVisitedBoardId", response.data._id);
            navigate(`/board/${response.data._id}`);
          }
        } else {
          // Nếu không có token, chuyển đến login
          navigate("/login");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedBoardId");
        navigate("/login");
      }
    };

    checkAuthAndRedirect();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Task Board
        </h1>
        <p className="text-gray-600">Loading your boards...</p>
      </div>
    </div>
  );
};

export default HomePage;
