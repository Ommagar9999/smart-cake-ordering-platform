import { useAuth } from "../context/AuthContext";
import "./Profile.css";
function Profile() {
  const { user } = useAuth();

  const firstName =
    user?.firstName || "User";

  const lastName =
    user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const avatar =
    firstName.charAt(0).toUpperCase();

  return (
    <main className="profile-page">

      {/* =====================================
          PROFILE HEADER
      ===================================== */}

      <div className="profile-page-heading">

        <span>MY ACCOUNT</span>

        <h1>
          My Profile
        </h1>

        <p>
          Manage and view your account information.
        </p>

      </div>


      {/* =====================================
          PROFILE CARD
      ===================================== */}

      <div className="profile-card-large">

        {/* AVATAR */}

        <div className="profile-avatar-large">
          {avatar}
        </div>


        {/* NAME */}

        <h1>
          {fullName}
        </h1>


        {/* EMAIL */}

        <p className="profile-email">
          {user?.email || "No email available"}
        </p>


        {/* =================================
            PROFILE DETAILS
        ================================= */}

        <div className="profile-details">

          {/* EMAIL */}

          <div className="profile-detail-item">

            <span>
              EMAIL
            </span>

            <strong>
              {user?.email || "-"}
            </strong>

          </div>


          {/* PHONE */}

          <div className="profile-detail-item">

            <span>
              PHONE
            </span>

            <strong>
              {user?.phoneNumber || "-"}
            </strong>

          </div>


          {/* ROLE */}

          <div className="profile-detail-item">

            <span>
              ACCOUNT TYPE
            </span>

            <strong>
              {user?.role || "USER"}
            </strong>

          </div>

        </div>


        {/* =================================
            ACCOUNT STATUS
        ================================= */}

        <div className="profile-account-status">

          <span className="status-dot"></span>

          <div>
            <strong>
              Account Active
            </strong>

            <small>
              Your Smart Cake account is active.
            </small>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;