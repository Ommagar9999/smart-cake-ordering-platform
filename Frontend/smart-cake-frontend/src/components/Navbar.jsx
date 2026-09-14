
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({
  onLogin,
  onRegister,
}) {
  const navigate = useNavigate();

  const {
    isLoggedIn,
    role,
    logout,
  } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  // ==========================================
  // NORMALIZE ROLE
  // ==========================================

  const userRole = role
    ?.toString()
    .replace("ROLE_", "")
    .trim()
    .toUpperCase();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="navbar">

      {/* ======================================
          LOGO
      ====================================== */}

      <div
        className="navbar-logo"
        onClick={() => goTo("/")}
      >
        <span className="logo-icon">
          🍰
        </span>

        <span className="logo-text">
          Cake<span>On</span>
        </span>
      </div>


      {/* ======================================
          NAVIGATION
      ====================================== */}

      <nav className="navbar-links">

        <button
          onClick={() => goTo("/")}
        >
          Home
        </button>

        <button
          onClick={() => goTo("/cakes")}
        >
          Cakes
        </button>

        <button
          onClick={() => goTo("/cart")}
        >
          Cart
        </button>

        {isLoggedIn && (
          <button
            onClick={() => goTo("/orders")}
          >
            Orders
          </button>
        )}

      </nav>


      {/* ======================================
          NAVBAR ACTIONS
      ====================================== */}

      <div className="navbar-actions">

        {/* ====================================
            NOT LOGGED IN
        ==================================== */}

        {!isLoggedIn ? (
          <>
            <button
              className="nav-login"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              className="nav-register"
              onClick={onRegister}
            >
              Register
            </button>
          </>
        ) : (

          /* ====================================
             LOGGED IN
          ==================================== */

          <div className="profile-wrapper">

            {/* ==================================
                ACCOUNT BUTTON
            ================================== */}

            <button
              className="profile-button"
              onClick={() =>
                setProfileOpen(
                  (previous) => !previous
                )
              }
            >
              <span className="profile-icon">
                👤
              </span>

              <span>
                Account
              </span>

              <span className="profile-arrow">
                {profileOpen ? "▲" : "▼"}
              </span>
            </button>


            {/* ==================================
                DROPDOWN
            ================================== */}

            {profileOpen && (
              <div className="profile-dropdown">

                {/* =================================
                    MY PROFILE
                ================================= */}

                <button
                  onClick={() =>
                    goTo("/profile")
                  }
                >
                  👤 My Profile
                </button>


                {/* =================================
                    MY ORDERS
                ================================= */}

                <button
                  onClick={() =>
                    goTo("/orders")
                  }
                >
                  📦 My Orders
                </button>


                {/* =================================
                    ADMIN DASHBOARD
                ================================= */}

                {userRole === "ADMIN" && (
                  <button
                    onClick={() =>
                      goTo("/admin")
                    }
                  >
                    ⚙️ Admin Dashboard
                  </button>
                )}


                {/* =================================
                    DELIVERY DASHBOARD
                ================================= */}

              {(userRole === "ADMIN" || userRole === "DELIVERY") && (
  <button
    onClick={() => goTo("/delivery")}
  >
    🚚 Delivery Dashboard
  </button>
)}


                {/* =================================
                    DIVIDER
                ================================= */}

                <div className="dropdown-divider" />


                {/* =================================
                    LOGOUT
                ================================= */}

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>
        )}

      </div>

    </header>
  );
}

export default Navbar;

