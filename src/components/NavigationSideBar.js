import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Sidebar.css";
import APP_STRINGS from "../util/strings";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError(APP_STRINGS.LANDING_FAILED_TO_LOG_OUT);
      console.error(error);
    }
  }

  return (
    <div className="sidebar">
      <Link to="/" className="brand mb-4">
        {APP_STRINGS.NAV_WISH_EU}
      </Link>
      <div className="nav-item">
        <div className="disabled nav-section">{APP_STRINGS.NAV_DATA_ENTRY}</div>
        <div className="sub-nav">
          <Link to="/org/employees" className="nav-link">
            {APP_STRINGS.NAV_EMPLOYEES}
          </Link>
          <Link to="/org/locations" className="nav-link">
            {APP_STRINGS.NAV_CATEGORIES}
          </Link>
          <Link to="/org/enter-sick-leave" className="nav-link">
            {APP_STRINGS.NAV_SICK_LEAVE}
          </Link>
          <Link to="/org/vacations" className="nav-link">
            {APP_STRINGS.NAV_VACATION}
          </Link>
        </div>
        <div className="nav-item">
          <div className="nav-section disabled">
            {APP_STRINGS.NAV_REPORT_VIEW}
          </div>
          <div className="sub-nav">
            <Link to="/org/reports" className="nav-link">
              {APP_STRINGS.NAV_REPORTS}
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="logout-contact">
        <button className="nav-link" onClick={handleLogout}>
          {APP_STRINGS.NAV_LOG_OUT}
        </button>
      </div>
    </div>
  );
};

function NavigationSideBar() {
  const { isOrg, currentUser } = useAuth();

  if (currentUser && isOrg) {
    return <SideBar />;
  }
}

export default NavigationSideBar;
