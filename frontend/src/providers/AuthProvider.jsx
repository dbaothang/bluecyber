import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Verify token with server if needed
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Optionally fetch user data here
          setUser({ token });
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Gửi yêu cầu đăng nhập
      const { data } = await api.post("/api/user/login", { email, password });

      // 2. Lưu token và cấu hình header cho các request tiếp theo
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      let boards = [];

      // 3. Gửi yêu cầu lấy danh sách boards
      const boardsResponse = await api.get(`/api/user/${data.userId}/boards`);
      boards = boardsResponse.data;

      // 4. Nếu chưa có board nào, tạo một board mặc định
      if (boards.length === 0) {
        const newBoardResponse = await api.post("/api/boards", {
          name: "My First Board",
          description: "This board was created automatically after login.",
        });

        const newBoard = newBoardResponse.data;
        boards.push(newBoard); // thêm board mới vào danh sách
      }

      // 5. Cập nhật state người dùng
      setUser({
        token: data.token,
        userId: data.userId,
        email: data.email,
        boards: boards,
      });

      // 6. Chuyển hướng đến board đầu tiên
      navigate(`/board/${boards[0]._id}`);

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      const { data } = await api.post("/api/user/signup", {
        email,
        password,
        confirmPassword,
      });

      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setUser({
        token: data.token,
        userId: data.userId,
        email: data.email,
      });

      // 🔴 Sửa chỗ này: Xóa đoạn redirect ở đây
      return data; // Chỉ trả về data thôi
    } catch (err) {
      console.error("Signup failed:", err);
      throw err; // Giữ nguyên để xử lý lỗi ở phía component
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastVisitedBoardId");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user?.token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
