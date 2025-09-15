import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./FlightsList.css";
import { baseURL, FILTER_FLIGHTS } from "../Api/Api";

export default function FlightsList() {
  const location = useLocation();
  const formData = location.state;
  const passenger_count = formData.adults;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line
  }, [sortBy]);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      let payload = {};
      if (formData.tripType === "oneway") {
        payload = {
          starting_point_location: formData.departure,
          landing_point_location: formData.arrival,
          is_round_trip: 0,
          date: formData.startDate,
          passenger_count: formData.adults,
        };
      } else {
        payload = {
          starting_point_location: formData.departure,
          landing_point_location: formData.arrival,
          is_round_trip: 1,
          departure_date: formData.startDate,
          return_date: formData.endDate,
          passenger_count: formData.adults,
        };
      }

      if (sortBy) {
        payload.sort_by = sortBy;
      }

      const res = await axios.post(`${baseURL}/${FILTER_FLIGHTS}`, payload);
      if (res.data.status) {
        setFlights(res.data.data);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error(err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };
  const handleCardClick = (id, isOneWay) => {
    if (isOneWay) {
      navigate(`/flight-information/${id[0]}`, {
        state: { passenger_count,isTwoWay:false,isFirst:true, },
      });
    } else {
      navigate(`/flight-information/${id[0]}`, {
        state: {
          passenger_count,
          returnFlightId: id[1],
          isTwoWay:true,
          isFirst:true,
        },
      });
    }
  };
  return (
    <div className="flights-container">
      <h2 className="flights-title">Available flights ✈</h2>

      <div className="filter-bar">
        <button
          className={sortBy === "" ? "active" : ""}
          onClick={() => setSortBy("")}
        >
          everyone 🌍
        </button>
        <button
          className={sortBy === "price" ? "active" : ""}
          onClick={() => setSortBy("price")}
        >
          The cheapest 💰
        </button>
        <button
          className={sortBy === "shortest" ? "active" : ""}
          onClick={() => setSortBy("shortest")}
        >
          The fastest ⚡
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading flights...</p>
      ) : flights.length === 0 ? (
        <p className="no-results">There are no flights available</p>
      ) : (
        flights.map((flight, idx) => {
          if (formData.tripType === "oneway" || flight.air_line) {
            return (
              <div
                onClick={() => {
                  handleCardClick([flight.id],true);
                }}
                className="flight-card"
                key={idx}
              >
                <div className="flight-header">
                  <span className="airline">
                    {flight.air_line?.air_line_name}
                  </span>
                  <span className="price-tag">{flight.price} $</span>
                </div>
                <div className="flight-route">
                  <strong>{flight.starting_point_location}</strong>
                  <div className="arrow">➔</div>
                  <strong>{flight.landing_point_location}</strong>
                </div>
                <div className="flight-details">
                  <span>🕒 {flight.start_time}</span>
                  <span>⏱ {flight.estimated_time} ساعة</span>
                </div>
              </div>
            );
          }

          if (flight.go && flight.return) {
            return (
              <div onClick={()=>{
                handleCardClick([flight.go.id,flight.return.id],false)
              }} className="roundtrip-card" key={idx}>
                <div className="trip-header">
                  <span className="airline">
                    {flight.go.air_line?.air_line_name}
                  </span>
                  <span className="price-tag">
                    💰 {flight.go.price + flight.return.price} $
                  </span>
                </div>

                <div className="trip-segment">
                  <h4>go</h4>
                  <div className="flight-route">
                    <strong>{flight.go.starting_point_location}</strong>
                    <div className="arrow">➔</div>
                    <strong>{flight.go.landing_point_location}</strong>
                  </div>
                  <div className="flight-details">
                    <span>🕒 {flight.go.start_time}</span>
                    <span>⏱ {flight.go.estimated_time} ساعة</span>
                  </div>
                </div>

                <div className="trip-segment">
                  <h4>Return</h4>
                  <div className="flight-route">
                    <strong>{flight.return.starting_point_location}</strong>
                    <div className="arrow">➔</div>
                    <strong>{flight.return.landing_point_location}</strong>
                  </div>
                  <div className="flight-details">
                    <span>🕒 {flight.return.start_time}</span>
                    <span>⏱ {flight.return.estimated_time} ساعة</span>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })
      )}
    </div>
  );
}
