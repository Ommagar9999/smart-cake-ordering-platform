import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfileMenu({ onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="profile-dropdown">

      <div className="profile-header">

        <div className="profile-avatar">
          {user?.firstName?.charAt(0) || "U"}
        </div>

        <div>
          <strong>
            {user?.firstName || "User"}
          </strong>

          <small>
            {user?.email || ""}
          </small>
        </div>

      </div>

      <Link to="/profile">
        👤 My Profile
      </Link>

      <Link to="/orders">
        📦 My Orders
      </Link>

      <Link to="/cart">
        🛒 My Cart
      </Link>

      <button onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
}

export default ProfileMenu;