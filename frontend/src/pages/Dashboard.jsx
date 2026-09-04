import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api.js";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    getProfile(token)
      .then((data) => setUser(data.user))
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1200);
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-card">
          <p>{error}</p>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard">
        <div className="dashboard-card">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        {user.profile_pic_url ? (
          <img className="dashboard-avatar" src={user.profile_pic_url} alt={user.name} />
        ) : (
          <div className="dashboard-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontSize: "1.8rem" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h2>Welcome, {user.name}</h2>
        <div className="email">{user.email}</div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
