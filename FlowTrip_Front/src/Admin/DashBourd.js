import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DashBourd.css";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, LOGOUT } from "../Api/Api";

export default function DashBourd() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(`${baseURL}/${LOGOUT}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error during logout. Please try again.");
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="maincontainer">
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`sidpare ${isMobileMenuOpen ? "open" : ""}`}
      >
        {/* زر فتح/إغلاق الموبايل */}
        <div
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </div>

        <img
          src={require("../Assets/logo-removebg-preview.png")}
          alt="Logo"
        />

        <div className="menu-links">
          <Link
            to="/Admin/dashboard/requist"
            className={
              activeLink === "/Admin/dashboard/requist" ? "active-link" : ""
            }
          >
            <i className="fas fa-clipboard-list"></i>
            <p>Requists</p>
          </Link>

          <Link
            to="/Admin/dashboard/packages"
            className={
              activeLink === "/Admin/dashboard/packages" ? "active-link" : ""
            }
          >
            <i className="fas fa-cubes"></i>
            <p>Packages</p>
          </Link>

          <Link
            to="/Admin/dashboard/owners"
            className={
              activeLink === "/Admin/dashboard/owners" ? "active-link" : ""
            }
          >
            <i className="fas fa-user-tie"></i>
            <p>Owners</p>
          </Link>

          <Link
            to="/Admin/dashboard/subadmin"
            className={
              activeLink === "/Admin/dashboard/subadmin" ? "active-link" : ""
            }
          >
            <i className="fas fa-chess-king"></i>
            <p>SubAdmin</p>
          </Link>

          <Link
            to="/Admin/dashboard/users"
            className={
              activeLink === "/Admin/dashboard/users" ? "active-link" : ""
            }
          >
            <i className="fas fa-users"></i>
            <p>Users</p>
          </Link>

          <Link
            to="/Admin/dashboard/activity"
            className={
              activeLink === "/Admin/dashboard/activity" ? "active-link" : ""
            }
          >
            <i className="fas fa-running"></i>
            <p>Activitys</p>
          </Link>

          <Link
            to="/Admin/dashboard/catigory"
            className={
              activeLink === "/Admin/dashboard/catigory" ? "active-link" : ""
            }
          >
            <i className="fas fa-layer-group"></i>
            <p>Catigory</p>
          </Link>

          {/* Contact */}
          <div
            onClick={() => window.open("https://wa.me/0938246910", "_blank")}
            className="logout-link"
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-phone"></i>
            <p>Contact us</p>
          </div>

          {/* Logout */}
          <div
            onClick={() => setShowLogoutConfirm(true)}
            className="logout-link"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <p>Log Out</p>
          </div>
        </div>
      </div>

      <Outlet />

      {showLogoutConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button onClick={handleLogout} className="confirm-btn">
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
