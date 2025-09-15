import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN } from "../Api/Api";
import {
  FaGift,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaSuitcaseRolling,
} from "react-icons/fa";
import "./Boockings.css";
import BookingsSkeleton from "./BookingsSkeleton";
import Cookies from "js-cookie";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token')||Cookies.get('token');
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/getBookings", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/not-registered",{replace:true});
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success) {
          setBookings(data.data);
        } else {
          navigate("/not-registered",{replace:true});
        }
        setLoading(false);
      })
      .catch(() => {
        navigate("/not-registered",{replace:true});
        setLoading(false);
      });
  }, [navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "Not specified";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "00:00:00") return "Not specified";
    return timeStr;
  };

  return (
    <div className="bookings-page">
      <h1 className="bookings-title">My Bookings</h1>

      {loading ? (
        <BookingsSkeleton />
      ) : bookings.length === 0 ? (
        <p className="empty-text">No bookings yet</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking, index) => (
            <div
              key={`${booking.booking_type}-${booking.id}-${index}`}
              className="booking-card"
            >
              <div className="booking-header">
                {booking.booking_type === "package" ? (
                  <FaGift className="booking-icon gift" />
                ) : (
                  <FaSuitcaseRolling className="booking-icon flight" />
                )}
                <h2 className="booking-title">
                  {booking.booking_type === "package"
                    ? "Tour Package"
                    : "Flight Booking"}
                </h2>
              </div>

              <p className="booking-info">
                <strong>Name:</strong> {booking.traveler_name}
              </p>
              <p className="booking-info">
                <strong>National ID:</strong> {booking.national_number}
              </p>

              {booking.booking_type === "package" ? (
                <>
                  <p className="booking-info">
                    <strong>Description:</strong> {booking.discription}
                  </p>
                  <p className="booking-info">
                    <strong>Price:</strong> {booking.total_price} $
                  </p>
                  <img
                    src={`http://127.0.0.1:8000/storage/${booking.package_picture}`}
                    alt="Package"
                    className="booking-image"
                  />
                </>
              ) : (
                <>
                  <p className="booking-info">
                    <strong>Flight Number:</strong> {booking.flight_number}
                  </p>
                  <p className="booking-info">
                    <strong>Seat Number:</strong> {booking.seat_number}
                  </p>
                  <p className="booking-info">
                    <strong>Price:</strong> {booking.price} $
                  </p>
                  <p className="booking-info">
                    <strong>Flight Date:</strong> {formatDate(booking.date)}
                  </p>

                  <div className="flight-detail">
                    <FaPlaneDeparture className="flight-icon depart" />
                    <span>
                      <strong>Departure:</strong> {formatTime(booking.start_time)}
                    </span>
                  </div>

                  <div className="flight-detail">
                    <FaPlaneArrival className="flight-icon arrive" />
                    <span>
                      <strong>Arrival:</strong> {formatTime(booking.land_time)}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}