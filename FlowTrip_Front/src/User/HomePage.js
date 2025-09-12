import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  // <<<<<<< HEAD
  FaBars, FaTimes, FaUser, FaMoon, FaGlobe, FaPhone, FaHome, FaSuitcase, FaCar, FaHiking, FaRobot, FaBrain, FaInfoCircle, FaEnvelope,
} from "react-icons/fa";
import PackageCard from "../Component/PackageCard";
import Loader from "../Component/Loader";
import loadingImage from "../Assets/Loading_icon.gif";
import chatbotGif from "../Assets/chatbot1.gif";
import ChatBot from "./ChatBot";
// =======
//   FaBars, FaTimes, FaUser, FaMoon, FaGlobe, FaPhone, FaHome, FaSuitcase, FaCar, FaHiking,
// } from "react-icons/fa";
import PackageCardSkeleton from "../Component/PackageCardSkeleton";
import ActivityCardSkeleton from "../Component/ActivityCardSkeleton";
import AccommodationCardSkeleton from "../Component/AccommodationCardSkeleton";
// >>>>>>> 9344e3a299f530d174fcffbc7bfe1b09f3f8e2a5
import "./HomePage.css";
import { TOKEN, baseURL, LOGOUT } from "../Api/Api";
import Cookies from "js-cookie";

export default function Homepage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [accommodations, setAccommodations] = useState([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState(true);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const closeSidebar = () => setIsSidebarOpen(false);
  const closeChatBot = () => setIsChatBotOpen(false);
  const role = Cookies.get("role");

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
        // Clear all stored data
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("role");
        Cookies.remove("authToken");

        // Redirect to home
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      Cookies.remove("token");
      Cookies.remove("email");
      Cookies.remove("role");
      Cookies.remove("authToken");
      window.location.href = "/";
    }
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/getRandomAccommodations"
        );
        const data = await res.json();
        if (data) setAccommodations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAccommodations(false);
      }
    };
    fetchAccommodations();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/getRandomPackage");
        const data = await res.json();
        if (data && data.data) setPackages(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPackages(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/getRandomActivity");
        const data = await res.json();
        if (data) setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchPackages();
    fetchActivities();
  }, []);

  const handlePackageClick = (id) => navigate(`/package-details/${id}`);

  function ShowMore({ to = "/", label = "Show more" }) {
    const navigate = useNavigate();
    return (
      <button
        className="show-more-btn"
        onClick={() => navigate(to)}
        aria-label={label}
        title={label}
      >
        {label}
        <span className="show-more-arrow">›</span>
      </button>
    );
  }

  const slidesDesktop = Math.min(Math.max(packages.length, 1), 5);
  const sliderSettings = {
    dots: false,
    infinite: packages.length > 4,
    speed: 500,
    slidesToShow: slidesDesktop,
    slidesToScroll: 1,
    arrows: false,
    autoplay: packages.length > 1,
    autoplaySpeed: 2500,
    swipeToSlide: true,
    lazyLoad: "anticipated",
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(Math.max(packages.length, 1), 3) },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.min(Math.max(packages.length, 1), 2) },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "12px" },
      },
    ],
  };

  const getImageUrl = (picture) => {
    if (!picture) return null;
    if (picture.includes("storage\\")) {
      const fileName = picture.split("\\").pop();
      return `http://127.0.0.1:8000/storage/images/${fileName}`;
    }
    if (picture.includes("storage/")) {
      const fileName = picture.split("/").pop();
      return `http://127.0.0.1:8000/storage/images/${fileName}`;
    }
    return picture;
  };

  const openActivityModal = (act) => {
    setSelectedActivity(act);
    setIsActivityModalOpen(true);
  };
  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setSelectedActivity(null);
  };

  const buildWhatsAppLink = (phone, activityName, loc) => {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return null;
    const msg = `Hello, I'm interested in "${activityName}"${
      loc ? ` in ${loc}` : ""
    }. Is it available?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  const handleAccommodationCardClick = (acc) => {
    const id = acc?.room_id ?? acc?.id ?? null;
    const type = acc?.type ?? (acc?.room_id ? "room" : "other");
    if (!id) {
      console.warn("Accommodation item missing id:", acc);
      return;
    }
    navigate(`/accommodation-preview/${id}`, { state: { type } });
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">Flow Trip</h2>
        <div className="navbar-icons">
          <div
            className="chatbot-icon"
            onClick={() => setIsChatBotOpen(true)}
            title="Chat Bot"
          >
            <img src={chatbotGif} alt="Chat Bot" className="chatbot-gif" />
          </div>

          {/* Conditional Register/Logout Button */}
          {TOKEN ? (
            <div
              className="auth-btn logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </div>
          ) : (
            <div
              className="auth-btn register-btn"
              onClick={() => navigate("/register")}
              title="Register"
            >
              <FaUser />
              <span>Register</span>
            </div>
          )}

          <div className="menu-icon" onClick={() => setIsSidebarOpen(true)} title="Settings">
            <FaBars />
          </div>
        </div>
      </nav>

      {/* Buttons */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/packages")}>
          <FaSuitcase /> Packages
        </button>
        <button onClick={() => navigate("/All-Activity")}>
          <FaHiking /> Activities
        </button>
        <button onClick={() => navigate("/accommodation-filter")}>
          <FaHome /> accommodations
        </button>
        <button onClick={() => navigate("/car-filter")}>
          <FaCar /> Cars
        </button>
      </div>

      {/* Overlay sidebar */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
      {/* Overlay chatbot */}
      {isChatBotOpen && <div className="overlay" onClick={closeChatBot}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>extra service</h3>
          <button className="close-btn" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul>
          <li onClick={() => navigate("/trip")}>
            <i className="fas fa-brain"></i>
            <p>Make a plan</p>
          </li>
          {role && role !== "" && role !== "user" && (
            <>
              {role === "Airline" && (
                <li onClick={() => navigate("/plans")}>
                  <i className="fas fa-plane"></i>
                  <p>Dashboard</p>
                </li>
              )}
              {role === "Tourism Company" && (
                <li
                  onClick={() => navigate("/TourismCompany/dashboard/packages")}
                >
                  <i className="fas fa-suitcase"></i>
                  <p>Dashboard</p>
                </li>
              )}
              {role === "admin" && (
                <li onClick={() => navigate("/Admin/dashboard")}>
                  <i className="fas fa-suitcase"></i>
                  <p>Dashboard</p>
                </li>
              )}
              {role === "Vehicle Owner" && (
                <li onClick={() => navigate("/VehiclyOwner/dashboard/vehiclys")}>
                  <i className="fas fa-suitcase"></i>
                  <p>Dashboard</p>
                </li>
              )}
              {/* {role === "ActivityOwner" && (
                <li
                  onClick={() => navigate("/")}
                >
                  <i className="fas fa-suitcase"></i>
                  <p>Dashboard</p>
                </li>
              )} */}
              {role !== "Airline" &&
                role !== "Tourism Company" &&
                role !== "admin" &&
                role !== "Airlines Company" &&
                role !== "ActivityOwner" && 
                role !== "Vehicle Owner" && (
                  <li onClick={() => navigate("/Accommodation/dashboard")}>
                    <i className="fas fa-home"></i>
                    <p>Dashboard</p>
                  </li>
                )}
            </>
          )}
          <li onClick={() =>navigate('/boocking')}>
            <i class="fa-solid fa-suitcase-rolling"></i>
            <p>my boocking</p>
          </li>
          <li onClick={() => navigate('/about-us')}>
            <i className="fas fa-info-circle"></i>
            <p>About Us</p>
          </li>
          <li onClick={() => window.open("https://wa.me/0938246910", "_blank")}>
            <i className="fas fa-envelope"></i>
            <p>Connect Us</p>
          </li>
        </ul>
      </div>

      {/* ChatBot Sidebar */}
      <div className={`chatbot-sidebar ${isChatBotOpen ? "open" : ""}`}>
        <div className="chatbot-sidebar-header">
          <h3>💬 Chat Assistant</h3>
          <button className="close-btn" onClick={closeChatBot}>
            <FaTimes />
          </button>
        </div>
        <div className="chatbot-content">
          <ChatBot />
        </div>
      </div>

      <h2 style={{ textAlign: "center", margin: "40px 0", color: "#2c3e50" }}>
        ✨ Discover our special packages ✨
      </h2>

      {/* Packages slider */}
      {loadingPackages ? (
        <Slider
          {...{
            ...sliderSettings,
            slidesToShow: 4, // عدد سكيليتون بالكارو
            infinite: false,
            autoplay: false,
          }}
          className="package-slider"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`pkg-skel-${i}`}>
              <PackageCardSkeleton />
            </div>
          ))}
        </Slider>
      ) : (
        <Slider {...sliderSettings} className="package-slider">
          {packages.map((pkg) => (
            <div key={pkg.id}>
              <PackageCard
                id={pkg.id}
                image={getImageUrl(pkg.picture)}
                title={pkg.tourism_company?.company_name || "Unknown Company"}
                description={pkg.description}
                price={pkg.total_price}
                isPointPayment={pkg.payment_by_points === 1}
                onClick={() => handlePackageClick(pkg.id)}
              />
            </div>
          ))}
        </Slider>
      )}

      <div className="show-more-row">
        <ShowMore to="/packages" label="Show more" />
      </div>

      {/* Activities */}
      <h2
        style={{ textAlign: "center", margin: "60px 0 20px", color: "#2c3e50" }}
      >
        🌟 Discover our special activities 🌟
      </h2>

      {loadingActivities ? (
        <div className="activities-grid">
          {[0, 1].map((i) => (
            <ActivityCardSkeleton key={`a-lg-${i}`} size="large" />
          ))}
          {[0, 1, 2].map((i) => (
            <ActivityCardSkeleton key={`a-sm-${i}`} size="small" />
          ))}
        </div>
      ) : (
        <div className="activities-grid">
          {activities.map((act, index) => (
            <div
              key={act.id}
              className={`activity-card ${
                index < 2 ? "large-card" : "small-card"
              }`}
              onClick={() => openActivityModal(act)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" ? openActivityModal(act) : null
              }
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt={act.activity_name}
                className="activity-img"
              />
              <div className="activity-overlay">
                <h3>{act.activity_name}</h3>
                <p>{act.owner_name}</p>
                <p>
                  {act.location}, {act.country_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="show-more-row">
        <ShowMore to="/All-Activity" label="Show more" />
      </div>

      {/* Accommodations */}
      <h2
        style={{ textAlign: "center", margin: "60px 0 20px", color: "#2c3e50" }}
      >
        🏡 Discover our special stays 🏡
      </h2>
      <div className="section-divider"></div>

      {loadingAccommodations ? (
        <div className="accommodations-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <AccommodationCardSkeleton key={`acc-skel-${i}`} />
          ))}
        </div>
      ) : (
        <div className="accommodations-grid">
          {accommodations.map((acc) => {
            const hasOffer = acc?.offer_price && Number(acc.offer_price) !== 0;
            return (
              <div
                key={acc.room_id ?? acc.id}
                className="accommodation-card"
                onClick={() => handleAccommodationCardClick(acc)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleAccommodationCardClick(acc) : null
                }
                title="View details"
              >
                <img
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"
                  alt={
                    acc.type_name || acc.accommodation_name || "Accommodation"
                  }
                  className="accommodation-img"
                />
                <div className="accommodation-info">
                  <h3>
                    {acc.type_name || acc.accommodation_name || "Accommodation"}
                  </h3>
                  <p>{acc.owner_location || acc.location}</p>
                  <p>
                    {hasOffer ? (
                      <>
                        <span className="old-price">${acc.price}</span>{" "}
                        <span className="new-price">${acc.offer_price}</span>
                      </>
                    ) : acc?.price ? (
                      <span>${acc.price}</span>
                    ) : (
                      <span>Price not available</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="show-more-row">
        <ShowMore to="/accommodation-filter" label="Show more" />
      </div>

      {/* Modal */}
      {isActivityModalOpen && selectedActivity && (
        <div className="modal-overlay" onClick={closeActivityModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="actModalTitle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="actModalTitle">Do you want to book this activity?</h3>
              <button
                className="modal-close"
                onClick={closeActivityModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-title">{selectedActivity.activity_name}</p>
              <p className="modal-row">
                <strong>Owner:</strong> {selectedActivity.owner_name || "—"}
              </p>
              <p className="modal-row">
                <strong>Phone:</strong>{" "}
                {selectedActivity.phone_number ? (
                  <a href={`tel:${selectedActivity.phone_number}`}>
                    {selectedActivity.phone_number}
                  </a>
                ) : (
                  "—"
                )}
              </p>
            </div>

            <div className="modal-actions">
              {selectedActivity.phone_number ? (
                <a
                  className="btn btn-whatsapp"
                  href={buildWhatsAppLink(
                    selectedActivity.phone_number,
                    selectedActivity.activity_name,
                    selectedActivity.location
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact on WhatsApp
                </a>
              ) : (
                <button className="btn btn-disabled" disabled>
                  WhatsApp unavailable
                </button>
              )}
              <button className="btn btn-danger" onClick={closeActivityModal}>
                <FaTimes style={{ marginRight: 6 }} /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
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
