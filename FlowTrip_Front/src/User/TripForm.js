import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripForm.css";

export default function TripForm() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("medium");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/summary", {
      state: { destination, days, budget, description },
    });
  };

  return (
    <div className="tripformcontainer">
    <div className="trip-form-container">
      <div className="form-header">
        <i className="fa-solid fa-calendar-days"></i> Plan Your Trip
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fa-solid fa-location-dot"></i> Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter trip destination"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-calendar-day"></i> Number of Days
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Enter number of days"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-sack-dollar"></i> Budget
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="low">Low - اصلا المصاري مو كلشي 😁</option>
            <option value="medium">Medium - عالله ويلا 😎</option>
            <option value="high">High - متاااح لك عمي😉</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>
            <i className="fa-solid fa-pen"></i> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add trip description"
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="send-btn">
          <i className="fa-solid fa-floppy-disk"></i> Save
        </button>
      </form>
    </div>
    </div>
  );
}