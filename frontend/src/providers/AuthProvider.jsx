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
      const { data } = await api.post("/api/user/login", { email, password });

      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Lấy thông tin boards của user sau khi login
      const boardsResponse = await api.get(`/api/user/${data.userId}/boards`);

      setUser({
        token: data.token,
        userId: data.userId,
        email: data.email,
        boards: boardsResponse.data, // Lưu danh sách boards
      });

      // Redirect đến board đầu tiên nếu có
      if (boardsResponse.data.length > 0) {
        navigate(`/board/${boardsResponse.data[0]._id}`);
      } else {
        // Nếu không có board, tạo mới
        const newBoard = await api.post("/api/boards");
        navigate(`/board/${newBoard.data._id}`);
      }

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      const { data } = await api.post("/api/user/signup", { email, password });

      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setUser({
        token: data.token,
        userId: data.userId,
        email: data.email,
      });

      // Redirect đến board mới tạo
      if (data.boardId) {
        navigate(`/board/${data.boardId}`);
      } else {
        navigate("/");
      }

      return data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
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
