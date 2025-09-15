import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, TOKEN } from "../Api/Api";
import "./AccommodationPreview.css";
import fallbackImage from "../Assets/AccommodationImagejpg.jpg";
import BackButton from "../Component/BackButton";
import Booking from "../Component/Booking";
import Loader from "../Component/Loader";


export default function AccommodationPreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { type } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [accommodation, setAccommodation] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        setLoading(true);
        let endpoint =
          type === "room" ? `RoomDetails/${id}` : `AccommodationDetails/${id}`;

        const response = await axios.get(`${baseURL}/${endpoint}`);
        setAccommodation(response.data);
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
        toast.error("Failed to load accommodation details");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id, type]);

  const handleBooking = () => {
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
  };

  const handlePayment = async (paymentData) => {
    try {
      const paymentPayload = {  
        stripeToken: paymentData.stripeToken,
        amount: accommodation.price,
        traveler_name: paymentData.bookingData.travelerName,
        national_number: parseInt(paymentData.bookingData.nationalId),
        start_date: paymentData.bookingData.checkInDate,
        end_date: paymentData.bookingData.checkOutDate,
      };
      
      const apiEndpoint = type === 'room' 
        ? `${baseURL}/BookRoom/${id}`
        : `${baseURL}/BookAccommodation/${id}`;
      
        setLoading(true);

      const response = await axios.post(
        apiEndpoint,
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data); 
      if (response.data.success) {
        toast.success("Booking done successfully!");
        setShowBookingForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please check your details and try again.");
    }
    finally{
      setLoading(false);
    }
  };

  if (!accommodation) {
    return (
      <div className="acc-preview-accommodation-preview-error">
        <h2>Accommodation not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="acc-preview-back-button"
        >
          Go Back
        </button>
      </div>
    );
  }

  return loading ? <Loader/> : (
    <div className="acc-preview-accommodation-preview">
      <ToastContainer />

      <div className="acc-preview-accommodation-header">
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        />
      </div>

      <div
        className={`acc-preview-accommodation-pictures-section ${
          !accommodation.pictures || accommodation.pictures.length === 0
            ? "acc-preview-no-pictures"
            : ""
        }`}
        style={{ width: "85%" }}
      >
        <h2 className="acc-preview-accommodation-pictures-title">Pictures</h2>
        <div
          className={`acc-preview-css-slider-container ${
            accommodation.pictures && accommodation.pictures.length <= 3
              ? "acc-preview-no-animation"
              : ""
          } ${
            !accommodation.pictures || accommodation.pictures.length === 0
              ? "acc-preview-empty-container"
              : ""
          }`}
        >
          <div className="acc-preview-css-slider-track">
            {accommodation.pictures && accommodation.pictures.length > 0 ? (
              <>
                {accommodation.pictures.map((pic, idx) => (
                  <div
                    className="acc-preview-css-slide"
                    key={`original-${idx}`}
                  >
                    <img
                      src={
                        type === "room"
                          ? pic.room_picture
                            ? `http://localhost:8000/${pic.room_picture}`
                            : fallbackImage
                          : pic.reference
                          ? `http://localhost:8000/${pic.reference}`
                          : fallbackImage
                      }
                      alt={`${type === "room" ? "Room" : "Accommodation"} pic ${
                        idx + 1
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>
                ))}
                {/* Duplicate images for seamless loop - only if more than 3 images */}
                {accommodation.pictures.length > 3 &&
                  accommodation.pictures.map((pic, idx) => (
                    <div
                      className="acc-preview-css-slide"
                      key={`duplicate-${idx}`}
                    >
                      <img
                        src={
                          type === "room"
                            ? pic.room_picture
                              ? `http://localhost:8000/${pic.room_picture}`
                              : fallbackImage
                            : pic.reference
                            ? `http://localhost:8000/${pic.reference}`
                            : fallbackImage
                        }
                        alt={`${
                          type === "room" ? "Room" : "Accommodation"
                        } pic ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <div className="acc-preview-no-images">
                <span>No Images Available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="acc-preview-accommodation-content">
        <div className="acc-preview-accommodation-info-section">
          <h2>Basic Information</h2>
          <div className="acc-preview-info-grid">
            {type === "room" ? (
              <>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Hotel:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.hotel_name || ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Area:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.area ? `${accommodation.area} m²` : ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Capacity:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.people_count
                      ? `${accommodation.people_count} guests`
                      : ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">
                    Price per night:
                  </span>
                  <span className="acc-preview-info-value acc-preview-price">
                    {accommodation.offer_price &&
                    accommodation.offer_price !== "0" ? (
                      <>
                        <span className="acc-preview-original-price">
                          {accommodation.price}$
                        </span>
                        <span className="acc-preview-offer-price">
                          {accommodation.offer_price}$
                        </span>
                      </>
                    ) : (
                      <span>{accommodation.price + "$" || ""}</span>
                    )}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Location:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.location || ""}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Name:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.accommodation_name || ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Location:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.location || ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Area:</span>
                  <span className="acc-preview-info-value">
                    {accommodation.area ? `${accommodation.area} m²` : ""}
                  </span>
                </div>
                <div className="acc-preview-info-item">
                  <span className="acc-preview-info-label">Price:</span>
                  <span className="acc-preview-info-value acc-preview-price">
                    {accommodation.offer_price &&
                    accommodation.offer_price !== "0" ? (
                      <>
                        <span className="acc-preview-original-price">
                          {accommodation.price}$
                        </span>
                        <span className="acc-preview-offer-price">
                          {accommodation.offer_price}$
                        </span>
                      </>
                    ) : (
                      <span>{accommodation.price + "$" || ""}</span>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="acc-preview-accommodation-services-section">
          <h2>Services & Amenities</h2>
          <div className="acc-preview-services-list">
            {accommodation.services && accommodation.services.length > 0 ? (
              accommodation.services.map((service, index) => (
                <div key={index} className="acc-preview-service-card">
                  <span className="acc-preview-service-icon">🛎️</span>
                  <span className="acc-preview-service-name">
                    {service.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="acc-preview-no-services">
                <span>No services available</span>
              </div>
            )}
          </div>
        </div>

        {type === "room" && accommodation.description && (
          <div className="acc-preview-accommodation-description-section">
            <h2>Description</h2>
            <p className="acc-preview-description-text">
              {accommodation.description}
            </p>
          </div>
        )}

        <div className="acc-preview-accommodation-contact-section">
          <h2>Contact Information</h2>
          <div className="acc-preview-contact-info">
            <div className="acc-preview-contact-item">
              <span className="acc-preview-contact-label">Phone:</span>
              <span className="acc-preview-contact-value">
                {accommodation.phone || ""}
              </span>
            </div>
            <div className="acc-preview-contact-item">
              <span className="acc-preview-contact-label">Email:</span>
              <span className="acc-preview-contact-value">
                {accommodation.email || ""}
              </span>
            </div>
          </div>
        </div>

        {TOKEN && <div
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleBooking}
        >
          <div className="acc-preview-booking-container-button">
            <div className="acc-preview-hover acc-preview-bt-1"></div>
            <div className="acc-preview-hover acc-preview-bt-2"></div>
            <div className="acc-preview-hover acc-preview-bt-3"></div>
            <div className="acc-preview-hover acc-preview-bt-4"></div>
            <div className="acc-preview-hover acc-preview-bt-5"></div>
            <div className="acc-preview-hover acc-preview-bt-6"></div>
            <button className="acc-preview-bookButton"></button>
          </div>
        </div>}
      </div>

      {showBookingForm && (
        <div className="acc-preview-popup-overlay" onClick={closeBookingForm}>
          <Booking
            type={type}
            accommodation={accommodation}
            onClose={closeBookingForm}
            onPayment={handlePayment}
          />
        </div>
      )}
    </div>
  );
}
