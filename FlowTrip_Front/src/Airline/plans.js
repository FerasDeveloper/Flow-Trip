import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import AddPlane from "./AddPlane";
import { baseURL, LOGOUT } from "../Api/Api";
export default function Plans() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("/plans/showallplans");
  const [showAddPlaneModal, setShowAddPlaneModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(`${baseURL}/${LOGOUT}`, {
        method: "GET",
        headers: {
          Authorization: ` Bearer ${token}`,
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`sidpare ${collapsed ? "collapsed" : ""}`}>
        <img
          src={require("../Assets/logo-removebg-preview.png")}
          alt="Logo"
          className={collapsed ? "small" : ""}
        />
        <div
          className="longright"
          onClick={handleToggleCollapse}
          style={{ color: "var(--color1)" }}
        >
          <i
            className={`fa-solid fa-arrow-right-long ${
              collapsed ? "expanded" : ""
            }`}
          ></i>
        </div>
        <div style={{ width: "100%" }}>
          <Link
            to="/plans/showallplans"
            className={
              activeLink === "/plans/showallplans" ? "active-link" : ""
            }
          >
            <i className="fas fa-clipboard-list"></i>
            <p>Show plans</p>
          </Link>

          <Link
            to="/plans/getevaluation"
            className={
              activeLink === "/plans/getevaluation" ? "active-link" : ""
            }
          >
            <i className="fas fa-star"></i>
            <p>Evaluation</p>
          </Link>

          <div
            onClick={() => setShowAddPlaneModal(true)}
            className={`logout-link ${showAddPlaneModal ? "active-link" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-cubes"></i>
            <p>Add Plane</p>
          </div>

          <div
            onClick={() => window.open("https://wa.me/0938246910", "_blank")}
            className="logout-link"
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-phone"></i>
            <p>Contact us</p>
          </div>

          <div
            onClick={() => setShowLogoutConfirm(true)}
            className="logout-link"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <p>Log Out</p>
          </div>
        </div>
      </div>

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

      {showAddPlaneModal && (
        <AddPlane onClose={() => setShowAddPlaneModal(false)} />
      )}

      <div className="RightPare">
        <Outlet />
      </div>
    </div>
  );
}
