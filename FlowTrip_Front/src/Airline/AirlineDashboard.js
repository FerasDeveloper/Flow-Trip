import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AirlineDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("/Airline/dashboard/flights");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const handleLogout = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
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
            to="/Airline/dashboard/flights"
            className={
              activeLink === "/Airline/dashboard/flights" ? "active-link" : ""
            }
          >
            <i className="fa-solid fa-jet-fighter"></i>
            <p>Flights</p>
          </Link>
          <Link
            to="/Airline/dashboard/planes"
            className={
              activeLink === "/Airline/dashboard/showallplans"
                ? "active-link"
                : ""
            }
          >
            <i className="fa-solid fa-plane-up"></i>

            <p>Planes</p>
          </Link>

          <Link
            to="/Airline/dashboard/ratings"
            className={
              activeLink === "/Airline/dashboard/ratings" ? "active-link" : ""
            }
          >
            <i className="fa-solid fa-star"></i>
            <p>Ratings</p>
          </Link>

          <Link
            to="/Airline/dashboard/records"
            className={
              activeLink === "/Airline/dashboard/records" ? "active-link" : ""
            }
          >
            <i className="fa-regular fa-clipboard"></i>
            <p>Records</p>
          </Link>

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
};
export default AirlineDashboard;