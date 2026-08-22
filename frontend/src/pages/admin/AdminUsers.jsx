import { useEffect, useState } from "react";
import "../admin.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
const handleToggleBlock = async (id, currentlyBlocked) => {
  const action = currentlyBlocked ? "unblock" : "block";

  const confirmed = window.confirm(
    `Are you sure you want to ${action} this user?`
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://campuscrate-t5ls.onrender.com/api/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blocked: !currentlyBlocked,
        }),
      }
    );

    // IMPORTANT: read the response as text first
    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}: ${responseText}`
      );
    }

    // Only parse JSON if the server actually returned JSON
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        "Server did not return JSON. Check your backend route."
      );
    }

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user._id === id
          ? {
              ...user,
              blocked: !currentlyBlocked,
            }
          : user
      )
    );

  } catch (error) {
    console.error("BLOCK USER ERROR:", error);
    alert(error.message);
  }
};



  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          {error}
        </div>
      </div>
    );
  }

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => !user.blocked
  ).length;

  const blockedUsers = users.filter(
    (user) => user.blocked
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "admin"
  ).length;

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">
            ADMIN PANEL
          </p>

          <h1>
            Users
          </h1>

          <p className="admin-subtitle">
            Manage registered students and user accounts.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Total Users
          </span>

          <span className="admin-stat-number">
            {totalUsers}
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Active Users
          </span>

          <span className="admin-stat-number resolved-number">
            {activeUsers}
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Blocked Users
          </span>

          <span className="admin-stat-number pending-number">
            {blockedUsers}
          </span>
        </div>

      </div>

      {/* USERS SECTION */}
      <div className="admin-section">

        <div className="admin-section-header">
          <div>
            <h2>
              Registered Users
            </h2>
          </div>

          <span className="admin-count">
            {adminUsers} admin
            {adminUsers !== 1 ? "s" : ""}
          </span>
        </div>

        {users.length === 0 ? (

          <div className="admin-empty">

            <div className="admin-empty-icon">
              —
            </div>

            <h3>
              No users found
            </h3>

            <p>
              There are currently no registered users.
            </p>

          </div>

        ) : (

          <div className="users-list">

            {users.map((user) => (

              <div
                className="user-card"
                key={user._id}
              >

                {/* USER INFORMATION */}
                <div className="user-info">

                  <div className="user-avatar">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div className="user-main-info">

                    <h3>
                      {user.name}
                    </h3>

                    <p>
                      {user.email}
                    </p>

                  </div>

                </div>

                {/* USER ROLE */}
                <div className="user-role">

                  <span className="user-detail-label">
                    ROLE
                  </span>

                  <span
                    className={`role-badge ${
                      user.role === "admin"
                        ? "role-admin"
                        : "role-student"
                    }`}
                  >
                    {user.role}
                  </span>

                </div>

                {/* USER STATUS */}
                <div className="user-status">

                  <span className="user-detail-label">
                    STATUS
                  </span>

                  <span
                    className={`status-badge ${
                      user.blocked
                        ? "status-pending"
                        : "status-resolved"
                    }`}
                  >
                    {user.blocked
                      ? "Blocked"
                      : "Active"}
                  </span>

                </div>

                {/* ACTION */}
                <div className="user-action">

                  <button
                    className={
                      user.blocked
                        ? "admin-unblock-button"
                        : "admin-block-button"
                    }
                    onClick={() =>
                      handleToggleBlock(
                        user._id,
                        user.blocked
                      )
                    }
                  >
                    {user.blocked
                      ? "Unblock"
                      : "Block"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminUsers;

