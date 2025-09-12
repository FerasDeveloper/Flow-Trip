import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./FlightDetails.css";
import EditButton from "../Component/EditButton";
import DeleteButton from "../Component/DeleteButton";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import {
  baseURL,
  DELETE_FLIGHT,
  GET_FLIGHT_DETAILS,
  GET_SINGLE_PLANE,
  TOKEN,
} from "../Api/Api";
import Loader from "../Component/Loader";

const FlightDetails = () => {
  const token = TOKEN;
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [seats, setSeats] = useState([]);
  const [plane, setPlane] = useState();
  const [loading, setLoading] = useState(true);
  const fetchFlightData = async () => {
    setLoading(true);
    try {
      const flightRes = await axios.get(
        `${baseURL}/${GET_FLIGHT_DETAILS}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const flightData = flightRes.data.flight;
      console.log(flightData)
      flightData.start_time = toAmPm(flightData.start_time);
      flightData.land_time = toAmPm(flightData.land_time);

      setDetails(flightData);
      setSeats(flightRes.data.seats);

      const planeRes = await axios.get(
        `${baseURL}/${GET_SINGLE_PLANE}/${flightData.plane_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlane(planeRes.data.plane_type);
    } catch (err) {
      console.error("Error fetching flight or plane details:", err);
    } finally {
      setLoading(false);
    }
  };
const toAmPm = (timeStr) => {
  if (!timeStr) return "N/A";

  const [h, m] = timeStr.split(":");
  let hour = parseInt(h, 10);
  const minute = m || "00";

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; 

  return `${hour}:${minute} ${ampm}`;
};
  useEffect(() => {
    fetchFlightData();
  }, []);
  const handleEdit = () => {
    Cookies.set("flight_id", id);
    navigate(`/editFlight`);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/${DELETE_FLIGHT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Flight has been deleted successfully");
      setTimeout(() => {
        navigate("/Airline/dashboard/flights", { replace: true });
      }, 3000);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };
  const handleEditSeats = () => {
    Cookies.set("flight_id", id);

    window.location.replace("/editSeats");
  };
  const handleReservation = () => {
    navigate(`/flightReservation/${id}`);
  };
  if (loading) {
    return (
      <>
        <Loader />
        <ToastContainer />
      </>
    );
  }
  return (
    <div className="fd-wrapper py-5">
      {/* Flight Info */}
      <div className="fd-container bg-white rounded shadow p-4 mb-5">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-start flex-wrap mb-3">
            <h2 className="fd-title mb-3 mb-md-0 border-bottom border-3 border-primary pb-2">
              Flight Information
            </h2>
            <div className="fd-top-right-buttons d-flex flex-md-row flex-column gap-2 ms-md-auto">
              <EditButton onClick={handleEdit} />
              <DeleteButton onClick={handleDelete} />
            </div>
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
            {details.offer_price ? (
              <FlightField
                label="Offer Price"
                value={details.offer_price + " $"}
                colClasses="col-lg-4 col-md-6 col-sm-12"
              />
            ) : (
              <FlightField
                label="Price"
                value={details.price + " $"}
                colClasses="col-lg-4 col-md-6 col-sm-12"
              />
            )}
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
        <button className="fd-btn-reserve" onClick={handleReservation}>
          Reservations
        </button>
      </div>

      {/* Seats */}
      <div className="fd-container seats-section bg-white rounded shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fd-title mb-0">Seats</h2>
          <span className="fd-seat-count">{seats.length} seats</span>
        </div>
        <div className="row g-3">
          {seats &&
            seats.map((seat) => (
              <div key={seat.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div
                  className={`fd-seat-box ${
                    seat.reserved ? "reserved" : "available"
                  } d-flex flex-column justify-content-center align-items-center text-center user-select-none`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <p className="fs-4 mb-1">#{seat.seat_number}</p>
                  <p className="mb-0 fw-bold">{seat.price} $</p>
                  <span className="fd-seat-status mt-2">
                    {seat.reserved ? "Reserved" : "Available"}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div className="fd-edit-seats-wrapper">
          <button
            className="fd-btn fd-edit-seats-btn"
            onClick={handleEditSeats}
          >
            Edit Seats
          </button>
        </div>
      </div>
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

export default FlightDetails;
