import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">CampusCrate</Link>

      <Link to="/items">Browse</Link>

      {user ? (
        <>
          <Link to="/post/lost">Post Lost</Link>
          <Link to="/post/found">Post Found</Link>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-posts">My Posts</Link>
          <Link to="/my-claims">My Claims</Link>
          <Link to="/claims-received">Claims Received</Link>

          <span>Hi, {user.name}</span>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;