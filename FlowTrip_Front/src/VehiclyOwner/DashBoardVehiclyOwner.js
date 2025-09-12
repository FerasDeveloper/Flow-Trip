import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Admin/DashBourd.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, LOGOUT, TOKEN } from "../Api/Api";

export default function DashBoardVehiclyOwner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    const token = TOKEN;
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
      {/* <div className={`sidpare ${collapsed ? "collapsed" : ""}`}>
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
            to="/VehiclyOwner/dashboard/vehiclys"
            className={
              activeLink === "/VehiclyOwner/dashboard/vehiclys"
                ? "active-link"
                : ""
            }
          >
            <i className="fas fa-car"></i>
            <p>Vehiclys</p>
          </Link>

          <Link
            to="/VehiclyOwner/dashboard/profile"
            className={
              activeLink === "/VehiclyOwner/dashboard/profile"
                ? "active-link"
                : ""
            }
          >
            <i className="fas fa-user"></i>
            <p>Profile</p>
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
      </div> */}
      <div className={`sidpare ${collapsed ? "collapsed" : ""} ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </div>

        <img
          src={require("../Assets/logo-removebg-preview.png")}
          alt="Logo"
          className={collapsed ? "small" : ""}
        />

        <div className="menu-links">
          <Link
            to="/VehiclyOwner/dashboard/vehiclys"
            className={activeLink === "/VehiclyOwner/dashboard/vehiclys" ? "active-link" : ""}
          >
            <i className="fas fa-car"></i>
            <p>Vehiclys</p>
          </Link>

          <Link
            to="/VehiclyOwner/dashboard/profile"
            className={activeLink === "/VehiclyOwner/dashboard/profile" ? "active-link" : ""}
          >
            <i className="fas fa-user"></i>
            <p>Profile</p>
          </Link>

          <div
            onClick={() => window.open("https://wa.me/0938246910", "_blank")}
            className="logout-link"
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
}
