import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Admin/DashBourd.css";
import { baseURL, LOGOUT } from "../Api/Api";
import { label, path } from "framer-motion/client";
import Activity from "../Admin/Activity";

const role = Cookies.get("role") || localStorage.getItem("role");

// تعريف المينيوهات لكل نوع مستخدم
const menus = {
  admin: [
    { path: "requist", label: "Requists", icon: "fas fa-clipboard-list" },
    { path: "packages", label: "Packages", icon: "fas fa-cubes" },
    { path: "owners", label: "Owners", icon: "fas fa-user-tie" },
    { path: "subadmin", label: "SubAdmin", icon: "fas fa-chess-king" },
    { path: "users", label: "Users", icon: "fas fa-users" },
    { path: "activity", label: "Activitys", icon: "fas fa-running" },
    { path: "catigory", label: "Catigory", icon: "fas fa-layer-group" },
  ],
  "Tourism Company": [
    { path: "packages", label: "Packages", icon: "fas fa-box" },
    { path: "records", label: "Records", icon: "fas fa-clipboard-list" },
    { path: "profile", label: "Profile", icon: "fas fa-user" },
    { path: "Evaluation", label: "Evaluation", icon: "fas fa-star" },
  ],
  "Vehicle Owner": [
    { path: "vehiclys", label: "Vehiclys", icon: "fas fa-car" },
    { path: "profile", label: "Profile", icon: "fas fa-user" },
    { path: "Evaluation", label: "Evaluation", icon: "fas fa-star" },
  ],
  Accommodation: [
    { path: "profile", label: "Profile", icon: "fas fa-user" },
    { path: "records", label: "Records", icon: "fas fa-clipboard-list" },
    ...(role === "Hotel"
      ? [{ path: "rooms", label: "Rooms", icon: "fas fa-bed" }]
      : []),
    ...(role === "Hotel"
      ? [{ path: "offers", label: "Offers", icon: "fas fa-gift" }]
      : []),
    { path: "advanced", label: "Advanced", icon: "fas fa-cogs" },
    { path: "Evaluation", label: "Evaluation", icon: "fas fa-star" },
  ],
  Airline: [
    { path: "flights", label: "Flights", icon: "fa-solid fa-jet-fighter" },
    { path: "showallplans", label: "Planes", icon: "fa-solid fa-plane-up" },
    { path: "getevaluation", label: "Ratings", icon: "fa-solid fa-star" },
    { path: "records", label: "Records", icon: "fa-regular fa-clipboard" },
    { path: "profile", label: "Profile", icon: "fas fa-user" },
  ],
  Activity: [{ path: "profile", label: "Profile", icon: "fas fa-user" }],
};

export default function DashboardLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      const response = await fetch("127.0.0.1:8000/api/Logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        Cookies.remove("authToken");
        Cookies.remove("token");
        Cookies.remove("role");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/register");
          navigate("/");
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
        className={`sidpare ${isMobileMenuOpen ? "open" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        {/* زر الموبايل */}
        <div
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </div>

        <img
          src={require("../Assets/logo-removebg-preview.png")}
          alt="Logo"
          className={collapsed ? "small" : ""}
        />

        {/* زر التوسيع/الانكماش */}
        <div
          className="longright"
          onClick={handleToggleCollapse}
          style={{ color: "var(--color1)" }}
        >
          <i
            className={`fa-solid fa-arrow-right-long ${
              !collapsed ? "expanded" : ""
            }`}
          ></i>
        </div>

        {/* روابط القائمة حسب الدور */}
        <div className="menu-links">
          {menus[role]?.map((item, idx) => (
            <Link
              key={idx}
              to={`/${role.replace(" ", "")}/dashboard/${item.path}`}
              className={activeLink.includes(item.path) ? "active-link" : ""}
            >
              <i className={item.icon}></i>
              <p>{item.label}</p>
            </Link>
          ))}

          {/* Contact us */}
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

      {/* Popup logout confirm */}
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
