import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [postsResponse, claimsResponse] = await Promise.all([
          fetch("https://campuscrate-t5ls.onrender.com/api/items/my", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("https://campuscrate-t5ls.onrender.com/api/claims/my", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!postsResponse.ok || !claimsResponse.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const postsData = await postsResponse.json();
        const claimsData = await claimsResponse.json();

        setPosts(postsData);
        setClaims(claimsData);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1>Loading dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h1>{error}</h1>
      </div>
    );
  }

  const pendingClaims = claims.filter(
    (claim) => claim.status === "pending"
  );

  const approvedClaims = claims.filter(
    (claim) => claim.status === "approved"
  );

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Welcome back, {user?.name || "Student"}! Here's an overview of
          your CampusCrate activity.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="dashboard-stat-label">
            My Posts
          </div>

          <div className="dashboard-stat-number">
            {posts.length}
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-label">
            My Claims
          </div>

          <div className="dashboard-stat-number">
            {claims.length}
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-label">
            Pending Claims
          </div>

          <div className="dashboard-stat-number">
            {pendingClaims.length}
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-label">
            Approved Claims
          </div>

          <div className="dashboard-stat-number">
            {approvedClaims.length}
          </div>
        </div>

      </div>

      {/* RECENT POSTS */}
      <div className="dashboard-section">

        <h2>My Recent Posts</h2>

        {posts.length === 0 ? (
          <p>You haven't posted any items yet.</p>
        ) : (
          posts.slice(0, 5).map((item) => (
            <div key={item._id} className="dashboard-item">

              <h3>{item.title}</h3>

              <p>
                <strong>Type:</strong> {item.type}
              </p>

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              <Link to={`/items/${item._id}`}>
                View Details
              </Link>

              <hr />

            </div>
          ))
        )}

      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">

        <h2>Quick Actions</h2>

        <div className="dashboard-actions">

          <Link to="/post/lost">
            Post Lost Item
          </Link>

          <Link to="/post/found">
            Post Found Item
          </Link>

          <Link to="/items">
            Browse Items
          </Link>

          <Link to="/my-claims">
            View My Claims
          </Link>

          <Link to="/claims-received">
            Claims Received
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;