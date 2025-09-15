import React, { useState } from "react";
import styled from "styled-components";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PaymentCard from "./PaymentCard";
import SaveButton from "./SaveButton";
import PaymentButton from "./PaymentButton";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Booking = ({
  type,
  accommodation,
  flight,
  price,
  onClose,
  onPayment,
  outboundSeats,
  returnSeats,
  passenger_count,
  isTwoWay,
}) => {
  const location = useLocation();
  const bookingData = location.state || {};
  const [travelerData, setTravelerData] = useState(
    Array.from({ length: passenger_count }, () => ({
      traveler_name: "",
      national_number: "",
    }))
  );

  const isPackageBooking = type === "package" || bookingData.type === "package";
  const packageData = accommodation || bookingData.packageData;
  const paymentMethod =
    accommodation?.paymentMethod || bookingData.paymentMethod;
  const package_id = accommodation?.package_id || bookingData.package_id;

  const [formData, setFormData] = useState({
    nationalId: "",
    travelerName: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    holderName: "",
    expiry: "",
    cvv: "",
  });

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [currentDateType, setCurrentDateType] = useState("");
  const [tempDate, setTempDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelerData];
    updated[index][field] = value;
    setTravelerData(updated);
  };
  const handlePaymentClick = () => {
    let passengers;
    if (isTwoWay) {
      passengers = travelerData.map((t, index) => ({
        traveler_name: t.traveler_name,
        national_number: String(t.national_number),
        seat_number_outbound: String(outboundSeats[index]),
        seat_number_return: returnSeats?.[index]
          ? String(returnSeats[index])
          : "",
      }));
    } else {
      passengers = travelerData.map((t, index) => ({
        traveler_name: t.traveler_name,
        national_number: String(t.national_number),
        seat_number_outbound: String(outboundSeats[index]),
      }));
    }
    return {
      passengers,
    };
  };

  const handlePackageBooking = async () => {
    if (!formData.travelerName || !formData.nationalId) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
      });
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardData.cardNumber ||
        !cardData.holderName ||
        !cardData.expiry ||
        !cardData.cvv)
    ) {
      toast.error("Please fill in all card details", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        package_id: package_id,
        traveler_name: formData.travelerName,
        national_number: formData.nationalId,
        payment_method: paymentMethod,
      };

      // Add card data if payment method is card
      if (paymentMethod === "card") {
        bookingData.stripeToken = "tok_visa";
        bookingData.card_number = cardData.cardNumber;
        bookingData.card_holder = cardData.holderName;
        bookingData.expiry_date = cardData.expiry;
        bookingData.cvv = cardData.cvv;
      }

      // Print the data being sent to backend for debugging
      console.log("=== Data being sent to backend ===");
      console.log("URL:", "http://127.0.0.1:8000/api/book_package");
      console.log("Method:", "POST");
      console.log("Headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
      console.log("Payload:", JSON.stringify(bookingData, null, 2));
      console.log("=====================================");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/book_package",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onPayment && onPayment(response.data);
    } catch (error) {
      console.error("=== Booking Error Details ===");
      console.error("Error:", error);
      console.error("Response Status:", error.response?.status);
      console.error("Response Data:", error.response?.data);
      console.error("Response Headers:", error.response?.headers);
      console.error("============================");

      const errorMessage =
        error.response?.data?.message || "Failed to book package";
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderRoomFields = () => (
    <>
      <div className="booking-section">
        <h3>Booking Details</h3>
        <div className="booking-form-row">
          <div className="booking-form-group">
            <label>📅 Check-in Date</label>
            <div
              className="booking-date-selector"
              onClick={() => {
                setCurrentDateType("checkIn");
                setTempDate(checkInDate || new Date());
                setShowDateModal(true);
              }}
            >
              <span>
                {checkInDate
                  ? checkInDate.toLocaleDateString()
                  : "Select Check-in Date"}
              </span>
              <svg viewBox="0 0 24 24" className="booking-calendar-icon">
                <path
                  fill="currentColor"
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                />
              </svg>
            </div>
          </div>
          <div className="booking-form-group">
            <label>📅 Check-out Date</label>
            <div
              className="booking-date-selector"
              onClick={() => {
                setCurrentDateType("checkOut");
                setTempDate(checkOutDate || new Date());
                setShowDateModal(true);
              }}
            >
              <span>
                {checkOutDate
                  ? checkOutDate.toLocaleDateString()
                  : "Select Check-out Date"}
              </span>
              <svg viewBox="0 0 24 24" className="booking-calendar-icon">
                <path
                  fill="currentColor"
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="booking-form-row">
          <div className="booking-form-group">
            <label htmlFor="nationalId">National ID</label>
            <input
              type="number"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="booking-form-group">
            <label htmlFor="travelerName">Traveler Name</label>
            <input
              type="text"
              id="travelerName"
              name="travelerName"
              value={formData.travelerName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderAccommodationFields = () => (
    <>
      <div className="booking-section">
        <h3>Booking Details</h3>
        <div className="booking-form-row">
          <div className="booking-form-group">
            <label>📅 Check-in Date</label>
            <div
              className="booking-date-selector"
              onClick={() => {
                setCurrentDateType("checkIn");
                setTempDate(checkInDate || new Date());
                setShowDateModal(true);
              }}
            >
              <span>
                {checkInDate
                  ? checkInDate.toLocaleDateString()
                  : "Select Check-in Date"}
              </span>
              <svg viewBox="0 0 24 24" className="booking-calendar-icon">
                <path
                  fill="currentColor"
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                />
              </svg>
            </div>
          </div>
          <div className="booking-form-group">
            <label>📅 Check-out Date</label>
            <div
              className="booking-date-selector"
              onClick={() => {
                setCurrentDateType("checkOut");
                setTempDate(checkOutDate || new Date());
                setShowDateModal(true);
              }}
            >
              <span>
                {checkOutDate
                  ? checkOutDate.toLocaleDateString()
                  : "Select Check-out Date"}
              </span>
              <svg viewBox="0 0 24 24" className="booking-calendar-icon">
                <path
                  fill="currentColor"
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="booking-form-row">
          <div className="booking-form-group">
            <label htmlFor="nationalId">National ID</label>
            <input
              type="number"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="booking-form-group">
            <label htmlFor="travelerName">Traveler Name</label>
            <input
              type="text"
              id="travelerName"
              name="travelerName"
              value={formData.travelerName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
  const renderAirlineFields = () => (
    <div className="booking-section">
      <h3>Booking Details</h3>
      {travelerData.map((t, index) => (
        <div className="booking-form-row" key={index}>
          <div className="booking-form-group">
            <label>Traveler {index + 1} Name</label>
            <input
              type="text"
              value={t.traveler_name}
              onChange={(e) =>
                handleTravelerChange(index, "traveler_name", e.target.value)
              }
              placeholder="Enter Traveler Name"
              required
            />
          </div>
          <div className="booking-form-group">
            <label>Traveler {index + 1} National ID</label>
            <input
              type="number"
              value={t.national_number}
              onChange={(e) =>
                handleTravelerChange(index, "national_number", e.target.value)
              }
              placeholder="Enter National ID"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPackageFields = () => (
    <>
      <div className="booking-section">
        <h3>Package Booking Details</h3>
        <div className="booking-form-row">
          <div className="booking-form-group">
            <label htmlFor="nationalId">National Number</label>
            <input
              type="number"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter National Number"
              required
            />
          </div>
          <div className="booking-form-group">
            <label htmlFor="travelerName">Traveler Name</label>
            <input
              type="text"
              id="travelerName"
              name="travelerName"
              value={formData.travelerName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
        </div>
        <div className="booking-payment-method">
          <h4>
            Payment Method:{" "}
            {paymentMethod === "card" ? "Credit Card" : "Points"}
          </h4>
          {paymentMethod === "points" && (
            <p className="booking-points-info">
              💰 Total Points Required:{" "}
              {(packageData?.total_price || packageData?.price) * 50} Points
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <StyledWrapper
      style={{ width: "75%", display: "flex", justifyContent: "center" }}
    >
      <div className="booking-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-header">
          <h2>
            Booking{" "}
            {isPackageBooking
              ? "Package"
              : type === "room"
              ? "Room"
              : type === "other"
              ? "Accommodation"
              : "Flight"}
          </h2>
          <button className="booking-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="booking-form"
        >
          {isPackageBooking ? (
            <div className="booking-accommodation-info">
              <h3>
                {packageData?.tourism_company?.company_name ||
                  packageData?.hotel_name}
              </h3>
              <p className="booking-location">📦 Package Booking</p>
              <p className="booking-price">
                💰{" "}
                <span>${packageData?.total_price || packageData?.price}</span>
                {paymentMethod === "points" && (
                  <span className="booking-points-price">
                    {" "}
                    or {(packageData?.total_price || packageData?.price) *
                      50}{" "}
                    Points
                  </span>
                )}
              </p>
              <p className="booking-description">{packageData?.discription}</p>
            </div>
          ) : type === "room" || type === "other" ? (
            <div className="booking-accommodation-info">
              <h3>
                {accommodation?.hotel_name || accommodation?.accommodation_name}
              </h3>
              <p className="booking-location">📍 {accommodation?.location}</p>
              <p className="booking-price">
                💰{" "}
                {accommodation?.offer_price &&
                accommodation.offer_price !== "0" ? (
                  <>
                    <span className="booking-original-price">
                      {accommodation.price}$
                    </span>
                    <span className="booking-offer-price">
                      {" "}
                      {accommodation.offer_price}$
                    </span>
                  </>
                ) : (
                  <span>{accommodation?.price}$</span>
                )}
                {type === "room" ? " / Night" : " / Day"}
              </p>
            </div>
          ) : (
            <div className="booking-accommodation-info">
              <h3>{flight.flight_number}</h3>
              <p className="booking-price">
                💰 <span>{price}$</span>
              </p>
            </div>
          )}

          {showDateModal && (
            <div
              className="booking-date-modal-overlay"
              onClick={() => setShowDateModal(false)}
            >
              <div
                className="booking-date-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="booking-date-modal-header">
                  <h3>Select Date</h3>
                  <button
                    className="booking-close-button"
                    onClick={() => setShowDateModal(false)}
                  >
                    ×
                  </button>
                </div>
                <Calendar
                  date={tempDate}
                  onChange={(date) => setTempDate(date)}
                />
                <div className="booking-date-modal-footer">
                  <button
                    onClick={() => {
                      if (currentDateType === "checkIn")
                        setCheckInDate(tempDate);
                      else if (currentDateType === "checkOut")
                        setCheckOutDate(tempDate);
                      setShowDateModal(false);
                    }}
                    className="booking-submit-btn"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPackageBooking
            ? renderPackageFields()
            : type === "room"
            ? renderRoomFields()
            : type === "other"
            ? renderAccommodationFields()
            : renderAirlineFields()}

          {paymentMethod !== "points" && (
            <div className="booking-section">
              <h3>Payment Information</h3>
              <PaymentCard cardData={cardData} setCardData={setCardData} />
            </div>
          )}

          {isPackageBooking ? (
            <div className="booking-submit-section">
              <div className="pay-btn-container" onClick={handlePackageBooking}>
                <div className="pay-btn-left-side">
                  <div className="pay-btn-card">
                    <div className="pay-btn-card-line" />
                    <div className="pay-btn-buttons" />
                  </div>
                  <div className="pay-btn-post">
                    <div className="pay-btn-post-line" />
                    <div className="pay-btn-screen">
                      <div className="pay-btn-dollar">
                        {paymentMethod === "points" ? "★" : "$"}
                      </div>
                    </div>
                    <div className="pay-btn-numbers" />
                    <div className="pay-btn-numbers-line2" />
                  </div>
                </div>
                <div className="pay-btn-right-side">
                  <div className="pay-btn-new">
                    {isSubmitting
                      ? "Processing..."
                      : `Book ${
                          paymentMethod === "points" ? "with Points" : "Now"
                        }`}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <PaymentButton
              onPayment={onPayment}
              formData={
                type === "room" || type === "other" || isPackageBooking
                  ? formData
                  : handlePaymentClick()
              }
              cardData={cardData}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              accommodation={accommodation}
              type={type}
            />
          )}
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .booking-form {
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
    background: white;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .booking-form::-webkit-scrollbar {
    display: none;
  }

  .booking-form {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .booking-header {
    background: linear-gradient(
      135deg,
      var(--color1, #007bff),
      var(--color3, #28a745)
    );
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px 12px 0 0;
  }

  .booking-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .booking-close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .booking-close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .booking-form {
    padding: 25px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .booking-accommodation-info {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    border-left: 4px solid var(--color1, #007bff);
  }

  .booking-accommodation-info h3 {
    margin: 0 0 10px 0;
    color: var(--color2, #333);
    font-size: 1.3rem;
  }

  .booking-location,
  .booking-price {
    margin: 5px 0;
    color: var(--color2, #666);
    font-size: 1rem;
  }

  .booking-original-price {
    text-decoration: line-through;
    color: #999;
    margin-left: 10px;
  }

  .booking-offer-price {
    color: var(--color4, #dc3545);
    font-weight: 700;
    font-size: 1.1em;
  }

  .booking-points-price {
    color: #f7971e;
    font-weight: 700;
    font-size: 1.1em;
  }

  .booking-description {
    margin: 10px 0;
    color: var(--color2, #666);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .booking-payment-method {
    margin-top: 15px;
    padding: 15px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
  }

  .booking-payment-method h4 {
    margin: 0 0 10px 0;
    color: #856404;
    font-size: 1.1rem;
  }

  .booking-points-info {
    margin: 5px 0 0 0;
    color: #f7971e;
    font-weight: 600;
    font-size: 1rem;
  }

  /* Animated Payment Button Styles */
  .pay-btn-container {
    background-color: #ffffff;
    display: flex;
    width: 260px;
    height: 120px;
    position: relative;
    border-radius: 6px;
    transition: 0.3s ease-in-out;
    transform: scale(0.71, 0.6);
    margin: 20px auto;
    cursor: pointer;
  }

  .pay-btn-container:hover {
    transform: scale(0.8, 0.7);
  }

  .pay-btn-container:hover .pay-btn-left-side {
    width: 100%;
  }

  .pay-btn-left-side {
    background-color: #5de2a3;
    width: 130px;
    height: 120px;
    border-radius: 4px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    overflow: hidden;
  }

  .pay-btn-right-side {
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    justify-content: space-between;
    white-space: nowrap;
    transition: 0.3s;
  }

  .pay-btn-right-side:hover {
    background-color: #f9f7f9;
  }

  .pay-btn-new {
    font-size: 23px;
    font-family: "Lexend Deca", sans-serif;
    margin-left: 20px;
  }

  .pay-btn-card {
    width: 70px;
    height: 46px;
    background-color: #c7ffbc;
    border-radius: 6px;
    position: absolute;
    display: flex;
    z-index: 10;
    flex-direction: column;
    align-items: center;
    -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    -moz-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
  }

  .pay-btn-card-line {
    width: 65px;
    height: 13px;
    background-color: #80ea69;
    border-radius: 2px;
    margin-top: 7px;
  }

  .pay-btn-buttons {
    width: 8px;
    height: 8px;
    background-color: #379e1f;
    box-shadow: 0 -10px 0 0 #26850e, 0 10px 0 0 #56be3e;
    border-radius: 50%;
    margin-top: 5px;
    transform: rotate(90deg);
    margin: 10px 0 0 -30px;
  }

  .pay-btn-container:hover .pay-btn-card {
    animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
  }

  .pay-btn-container:hover .pay-btn-post {
    animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
  }

  @keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    50% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }
    60% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }
    100% {
      -webkit-transform: translateY(-8px) rotate(90deg);
      transform: translateY(-8px) rotate(90deg);
    }
  }

  .pay-btn-post {
    width: 63px;
    height: 75px;
    background-color: #dddde0;
    position: absolute;
    z-index: 11;
    bottom: 10px;
    top: 120px;
    border-radius: 6px;
    overflow: hidden;
  }

  .pay-btn-post-line {
    width: 47px;
    height: 9px;
    background-color: #545354;
    position: absolute;
    border-radius: 0px 0px 3px 3px;
    right: 8px;
    top: 8px;
  }

  .pay-btn-post-line:before {
    content: "";
    position: absolute;
    width: 47px;
    height: 9px;
    background-color: #757375;
    top: -8px;
  }

  .pay-btn-screen {
    width: 47px;
    height: 23px;
    background-color: #ffffff;
    position: absolute;
    top: 22px;
    right: 8px;
    border-radius: 3px;
  }

  .pay-btn-numbers {
    width: 12px;
    height: 12px;
    background-color: #838183;
    box-shadow: 0 -18px 0 0 #838183, 0 18px 0 0 #838183;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 52px;
  }

  .pay-btn-numbers-line2 {
    width: 12px;
    height: 12px;
    background-color: #aaa9ab;
    box-shadow: 0 -18px 0 0 #aaa9ab, 0 18px 0 0 #aaa9ab;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 68px;
  }

  @keyframes slide-post {
    50% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(-70px);
      transform: translateY(-70px);
    }
  }

  .pay-btn-dollar {
    position: absolute;
    font-size: 16px;
    font-family: "Lexend Deca", sans-serif;
    width: 100%;
    left: 0;
    top: 0;
    color: #4b953b;
    text-align: center;
  }

  .pay-btn-container:hover .pay-btn-dollar {
    animation: fade-in-fwd 0.3s 1s backwards;
  }

  @keyframes fade-in-fwd {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .booking-section {
    margin-bottom: 25px;
    padding: 20px;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    background: #fafafa;
  }

  .booking-section h3 {
    margin: 0 0 20px 0;
    color: var(--color2, #333);
    font-size: 1.2rem;
    border-bottom: 2px solid var(--color1, #007bff);
    padding-bottom: 8px;
  }

  .booking-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .booking-form-group {
    display: flex;
    flex-direction: column;
  }

  .booking-form-group label {
    margin-bottom: 8px;
    color: var(--color2, #555);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .booking-form-group input,
  .booking-form-group select,
  .booking-form-group textarea {
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
  }

  .booking-form-group input:focus,
  .booking-form-group select:focus,
  .booking-form-group textarea:focus {
    outline: none;
    border-color: var(--color1, #007bff);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .booking-services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 10px;
  }

  .booking-service-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .booking-service-checkbox:hover {
    background: #f0f8ff;
    border-color: var(--color1, #007bff);
  }

  .booking-service-checkbox input[type="checkbox"] {
    margin: 0;
    width: auto;
    height: auto;
  }

  .booking-payment-section {
    margin-bottom: 25px;
    padding: 20px;
    border: 2px dashed var(--color3, #28a745);
    border-radius: 12px;
    background: #f8fff9;
  }

  .booking-payment-section h3 {
    margin: 0 0 20px 0;
    color: var(--color3, #28a745);
    font-size: 1.2rem;
    text-align: center;
  }

  .booking-submit-section {
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #e9ecef;
  }

  .booking-submit-btn {
    background: linear-gradient(
      135deg,
      var(--color1, #007bff),
      var(--color3, #28a745)
    );
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .booking-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 123, 255, 0.4);
  }

  .booking-submit-btn:active {
    transform: translateY(0);
  }

  /* Date Selector Styles */
  .booking-date-selector {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 14px;
    background: #ffffff;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
  }

  .booking-date-selector:hover {
    border-color: #4a90e2;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
  }

  .booking-date-selector span {
    color: #333;
    flex: 1;
  }

  .booking-date-selector .booking-calendar-icon {
    width: 20px;
    height: 20px;
    color: #4a90e2;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .booking-date-selector:hover .booking-calendar-icon {
    opacity: 1;
  }

  /* Date Modal Styles */
  .booking-date-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 16px;
  }

  .booking-date-modal-content {
    background: white;
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
  }

  .booking-date-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e1e5e9;
  }

  .booking-date-modal-header h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }

  .booking-date-modal-header .booking-close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .booking-date-modal-header .booking-close-button:hover {
    background: #f5f5f5;
    color: #333;
  }

  .booking-date-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e1e5e9;
    display: flex;
    justify-content: flex-end;
  }

  /* Enhanced label styling for date fields */
  .booking-form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: var(--color2, #555);
    font-weight: 600;
    font-size: 1rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .booking-container {
      max-width: 95%;
      margin: 10px;
    }

    .booking-form {
      padding: 15px;
      max-height: 75vh;
    }

    .booking-form-row {
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .booking-services-grid {
      grid-template-columns: 1fr;
    }

    .booking-header h2 {
      font-size: 1.3rem;
    }

    .booking-submit-btn {
      padding: 12px 30px;
      font-size: 1rem;
    }

    .booking-date-selector {
      padding: 10px 14px;
      font-size: 0.95rem;
    }

    .booking-date-modal-content {
      margin: 0;
      border-radius: 0;
      width: 100vw;
      height: 100vh;
      max-width: none;
      max-height: none;
    }

    .booking-date-modal-overlay {
      padding: 0;
    }
  }

  @media (max-width: 480px) {
    .booking-accommodation-info,
    .booking-section,
    .booking-payment-section {
      padding: 15px;
    }

    .booking-header {
      padding: 15px;
    }

    .booking-header h2 {
      font-size: 1.2rem;
    }

    .booking-date-selector {
      padding: 8px 12px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 375px) {
    .visa-card {
      width: 240px;
      height: 145px;
    }
  }
`;

export default Booking;
