import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UserFlightInformation.css";
import {
  baseURL,
  GET_FLIGHT_DETAILS,
  GET_SINGLE_PLANE,
  TOKEN,
  Book_Flight,
} from "../Api/Api";
import Booking from "../Component/Booking";
import Loader from "../Component/Loader";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export const colors = {
  reserved: "#45576d",
  selected: "#aac7d7",
  available: "#dfebf7",
};

const UserFlightInformation = () => {
  const token = Cookies.get("token") || localStorage.getItem("token");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!token) {
      navigate("/not-registered");
      return;
    }
  }, [token, navigate]);
  const passenger_count = location.state.passenger_count;
  const isTwoWay = location.state.isTwoWay;
  const isFirst = location.state.isFirst;
  const returnFlightId = location.state.returnFlightId;
  const prevSelectedSeats = location.state.prevSelectedSeats || [];
  const prevTotalPrice = location.state.prevTotalPrice || 0;
  const firstFlightId = location.state.firstFlightId;

  const [details, setDetails] = useState(null);
  const [planeImage, setPlaneImage] = useState();
  const [seats, setSeats] = useState([]);
  const [plane, setPlane] = useState();
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState([]);
  const [selectedReturnSeats, setSelectedReturnSeats] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [airlineName, setAirlineName] = useState("");

  // إذا لم يكن هناك توكن، لا نستدعي البيانات
  const fetchFlightData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const flightRes = await axios.get(
        `${baseURL}/${GET_FLIGHT_DETAILS}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const flightData = flightRes.data.flight;
      console.log(flightData);
      setDetails(flightData);
      setSeats(flightRes.data.seats);
      setAirlineName(flightRes.data.air_line_name);
      setOwnerId(flightRes.data.owner_id);
      const planeRes = await axios.get(
        `${baseURL}/${GET_SINGLE_PLANE}/${flightData.plane_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlane(planeRes.data.plane_type);
      setPlaneImage(planeRes.data.image_url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
  }, [id]);

  const handleSeatClick = (seat_number) => {
    if (!token) {
      navigate("/not-registered");
      return;
    }
    
    if (isTwoWay) {
      if (isFirst) {
        setSelectedOutboundSeats((prev) =>
          prev.includes(seat_number)
            ? prev.filter((num) => num !== seat_number)
            : [...prev, seat_number]
        );
      } else {
        setSelectedOutboundSeats(prevSelectedSeats);
        setSelectedReturnSeats((prev) =>
          prev.includes(seat_number)
            ? prev.filter((num) => num !== seat_number)
            : [...prev, seat_number]
        );
      }
    } else {
      setSelectedOutboundSeats((prev) =>
        prev.includes(seat_number)
          ? prev.filter((num) => num !== seat_number)
          : [...prev, seat_number]
      );
    }
  };

  const handleBooking = () => {
    if (!token) {
      navigate("/not-registered");
      return;
    }
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
  };

  const handlePayment = async (paymentData) => {
    try {
      setLoading(true);

      const payload = {
        flight_id: id,
        ...paymentData,
      };

      if (isTwoWay) {
        payload.return_flight_id = returnFlightId;
        payload.flight_id = firstFlightId;
      }
      console.log(payload);
      const response = await axios.post(`${baseURL}/${Book_Flight}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Booking done successfully!");
        localStorage.setItem("bookingSuccess", "true");
        setTimeout(() => {
          if (localStorage.getItem("bookingClicked") !== "true") {
            navigate("/", { replace: true });
          }
          localStorage.removeItem("bookingSuccess");
          localStorage.removeItem("bookingClicked");
        }, 3000);

        setShowBookingForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Payment failed. Please check your details and try again.");
    }
  };

  const handleNext = () => {
    const selectedSeatObjs = seats.filter((s) =>
      selectedOutboundSeats.includes(s.seat_number)
    );
    const totalPrice = selectedSeatObjs.reduce((acc, s) => acc + s.price, 0);
    navigate(`/flight-information/${returnFlightId}`, {
      state: {
        firstFlightId: id,
        returnFlightId: returnFlightId,
        passenger_count,
        isTwoWay: true,
        isFirst: false,
        prevSelectedSeats: selectedOutboundSeats,
        prevTotalPrice: totalPrice,
      },
    });
  };
  const handleProfileClick = () => {
    navigate(`/owner_profile/${ownerId}`);
  };

  // إذا لم يكن المستخدم مسجلاً، لا نعرض المحتوى
  if (!token) {
    return null; // سيتم إعادة التوجيه في useEffect
  }

  if (loading)
    return (
      <>
        <Loader />
        <ToastContainer />
      </>
    );

  return (
    <div className="fd-wrapper py-5">
      <h1 className="airline-name" onClick={handleProfileClick}>{airlineName}</h1>
      <div className="fd-container bg-white rounded shadow p-4 mb-5">
        <div className="row">
          <div className="col-12 d-flex flex-column mb-3">
            <h2 className="fd-title mb-2 border-bottom border-3 border-primary pb-2">
              Flight Information
            </h2>
          </div>
        </div>
        {details && plane && (
          <div className="row g-4">
            <FlightField
              label="Flight Number"
              value={details.flight_number}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Date"
              value={details.date}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Start Time"
              value={details.start_time}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Land Time"
              value={details.land_time}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="From"
              value={details.starting_point_location}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="To"
              value={details.landing_point_location}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Starting Airport"
              value={details.starting_airport}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Landing Airport"
              value={details.landing_airport}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Price"
              value={details.price + " $"}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Plane Type"
              value={plane}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
            <FlightField
              label="Estimated Time"
              value={details.estimated_time}
              colClasses="col-lg-4 col-md-6 col-sm-12"
            />
          </div>
        )}
      </div>

      <div className="fd-container seats-section bg-white rounded shadow p-4">
        <div className="fd-seats-plane-row">
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fd-title mb-0">Seats</h2>
              <span className="fd-seat-count">{seats.length} seats</span>
            </div>
            <div className="row g-3">
              {seats.map((seat) => {
                let isSelected = isTwoWay
                  ? isFirst
                    ? selectedOutboundSeats.includes(seat.seat_number)
                    : selectedReturnSeats.includes(seat.seat_number)
                  : selectedOutboundSeats.includes(seat.seat_number);
                let bgColor = seat.reserved
                  ? colors.reserved
                  : isSelected
                  ? colors.selected
                  : colors.available;
                let textColor = seat.reserved ? "#fff" : "#000";
                return (
                  <div
                    key={seat.id}
                    className="col-lg-3 col-md-4 col-sm-6 col-12"
                  >
                    <div
                      className="fd-seat-box d-flex flex-column justify-content-center align-items-center text-center user-select-none"
                      style={{
                        aspectRatio: "1 / 1",
                        backgroundColor: bgColor,
                        color: textColor,
                        cursor: seat.reserved ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        !seat.reserved && handleSeatClick(seat.seat_number)
                      }
                    >
                      <p className="fs-4 mb-1">#{seat.seat_number}</p>
                      <p className="mb-0 fw-bold">{seat.price} $</p>
                      <span className="fd-seat-status mt-2">
                        {seat.reserved
                          ? "Reserved"
                          : isSelected
                          ? "Selected"
                          : "Available"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4 col-md-12 text-center">
            {planeImage && (
              <img
                src={planeImage}
                alt="Plane"
                className="img-fluid rounded shadow fd-plane-image"
              />
            )}
          </div>
        </div>

        {(!isTwoWay || (isTwoWay && !isFirst)) && (
          <div className="fd-book-flight-wrapper mt-4 text-center">
            <button
              className="fd-btn fd-book-flight-btn"
              onClick={handleBooking}
              disabled={
                isTwoWay
                  ? selectedOutboundSeats.length !== selectedReturnSeats.length
                  : selectedOutboundSeats.length !== passenger_count
              }
            >
              {isTwoWay
                ? selectedReturnSeats.length !== selectedOutboundSeats.length
                  ? `Select ${selectedOutboundSeats.length} to Book`
                  : "Book"
                : selectedOutboundSeats.length !== passenger_count
                ? `Select ${passenger_count} Seats to Book`
                : "Book"}
            </button>
          </div>
        )}

        {showBookingForm &&
          (() => {
            let totalPrice = 0;

            if (isTwoWay) {
              const returnSeatObjs = seats.filter((s) =>
                selectedReturnSeats.includes(s.seat_number)
              );
              totalPrice =
                prevTotalPrice +
                returnSeatObjs.reduce((acc, s) => acc + s.price, 0);
            } else {
              const outboundSeatObjs = seats.filter((s) =>
                selectedOutboundSeats.includes(s.seat_number)
              );
              totalPrice = outboundSeatObjs.reduce(
                (acc, s) => acc + s.price,
                0
              );
            }

            return (
              <div
                className="acc-preview-popup-overlay"
                onClick={closeBookingForm}
              >
                <Booking
                  onClose={closeBookingForm}
                  onPayment={handlePayment}
                  type=""
                  flight={details}
                  outboundSeats={selectedOutboundSeats}
                  returnSeats={selectedReturnSeats}
                  price={totalPrice}
                  passenger_count={passenger_count}
                  isTwoWay={isTwoWay}
                />
              </div>
            );
          })()}
      </div>

      {isTwoWay && isFirst && (
        <div className="fd-next-btn-wrapper text-center mt-4">
          <button
            disabled={selectedOutboundSeats.length !== passenger_count}
            className="fd-btn fd-next-btn"
            onClick={handleNext}
          >
            {selectedOutboundSeats.length !== passenger_count
              ? `Select ${passenger_count} seats`
              : "Next ➔"}
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

const FlightField = ({ label, value, colClasses }) => (
  <div className={colClasses}>
    <div className="fd-flight-field">
      <span className="fd-field-label">{label}:</span>
      <span className="fd-field-value">{value}</span>
    </div>
  </div>
);

export default UserFlightInformation;
