import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlightSearch.css";

export default function FlightSearch() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const navigate = useNavigate();

  const swapLocations = () => {
    setDeparture(arrival);
    setArrival(departure);
  };

  const handleSearch = () => {
    if (!departure || !arrival) {
      alert("Please enter both departure and arrival locations.");
      return;
    }
    navigate("/flight-details", {
      state: { departure, arrival }
    });
  };

  return (
    <div className="flight-container">
      <h2 className="titleFlightSearch">Book Your Flight</h2>

      <div className="inputs-row">
        <input
          type="text"
          placeholder="Enter departure location"
          className="input-field"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />

        <button className="swap-btn" onClick={swapLocations}>
          ⇅
        </button>

        <input
          type="text"
          placeholder="Enter arrival location"
          className="input-field"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
      </div>

      <button className="search-btn" onClick={handleSearch}>
        Search Flights
      </button>
    </div>
  );
}
