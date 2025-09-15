import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./FlightDetails.css";

export default function UserFlightDetails() {
  const location = useLocation();
  const { departure, arrival } = location.state || {};
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);

  const toLocalDateString = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const handleDateChange = (item) => {
    if (tripType === "oneway") {
      setDateRange([
        {
          startDate: item.selection.startDate,
          endDate: item.selection.startDate,
          key: "selection",
        },
      ]);
    } else {
      setDateRange([item.selection]);
    }
  };

  return (
    <div className="flight-step2-container">
      <h2 className="titleFlightDetails">Select flight details</h2>
      <p className="subtitle">
        <strong>from:</strong> {departure} | <strong>to:</strong> {arrival}
      </p>

      <div className="trip-type">
        <label>
          <input
            type="radio"
            value="oneway"
            checked={tripType === "oneway"}
            onChange={() => setTripType("oneway")}
          />
          One way
        </label>
        <label>
          <input
            type="radio"
            value="roundtrip"
            checked={tripType === "roundtrip"}
            onChange={() => setTripType("roundtrip")}
          />
          Back and forth
        </label>
      </div>

      <div className="calendar-wrapper">
        <DateRangePicker
          onChange={handleDateChange}
          ranges={dateRange}
          months={2}
          direction="horizontal"
          minDate={new Date()}
          rangeColors={["var(--color4)", "#3d91ff"]}
          editableDateInputs={true}
          moveRangeOnFirstSelection={false}
          showDateDisplay={true}
          showSelectionPreview={true}
        />
      </div>

      <div className="passenger-section">
        <div className="passenger-row">
          <span>Adults</span>
          <div className="counter">
            <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
            <span>{adults}</span>
            <button onClick={() => setAdults(adults + 1)}>+</button>
          </div>
        </div>
        <div className="passenger-row">
          <span>Babys</span>
          <div className="counter">
            <button onClick={() => setInfants(Math.max(0, infants - 1))}>-</button>
            <span>{infants}</span>
            <button onClick={() => setInfants(infants + 1)}>+</button>
          </div>
        </div>
      </div>

      <button
        className="continue-btn"
        onClick={() => {
          navigate("/flights-list", {
            state: {
              tripType,
              departure,
              arrival,
              startDate: toLocalDateString(dateRange[0].startDate),
              endDate: toLocalDateString(dateRange[0].endDate),
              adults,
              infants,
            },
          });
        }}
      >
        Next
      </button>
    </div>
  );
}