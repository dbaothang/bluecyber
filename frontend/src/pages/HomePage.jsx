import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import api from "../api";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to the user's board
      api
        .get("/api/boards")
        .then((response) => {
          if (response.data.length > 0) {
            navigate(`/board/${response.data[0]._id}`);
          } else {
            // Create a new board if none exists
            api.post("/api/boards").then((response) => {
              navigate(`/board/${response.data._id}`);
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching boards:", err);
        });
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
