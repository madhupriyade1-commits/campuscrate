import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          CampusCrate
        </Link>

        <div className="navbar-links">

          <Link to="/items" className="nav-link">
            Browse
          </Link>

          {user && (
            <>
              <Link to="/post/lost" className="nav-link">
                Post Lost
              </Link>

              <Link to="/post/found" className="nav-link">
                Post Found
              </Link>

              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              <Link to="/my-posts" className="nav-link">
                My Posts
              </Link>

              <Link to="/my-claims" className="nav-link">
                My Claims
              </Link>

              <Link to="/claims-received" className="nav-link">
                Claims Received
              </Link>

              {user.role === "admin" && (
                <>
                  <Link to="/admin/users" className="nav-link">
                    Admin Users
                  </Link>

                  <Link to="/admin/items" className="nav-link">
                    Admin Items
                  </Link>

                  <Link to="/admin/reports" className="nav-link">
                    Reports
                  </Link>
                </>
              )}
            </>
          )}

        </div>

        <div className="navbar-user">

          {user ? (
            <>
              <span className="user-name">
                Hi, {user.name}
              </span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="register-button">
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;

