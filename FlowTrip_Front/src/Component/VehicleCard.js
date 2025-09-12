import React from "react";
import "./VehicleCard.css";

const VehicleCard = ({ vehicle, onClick }) => {
  console.log(vehicle.picture_url);
  return (
    <div className="vehicle-card" onClick={onClick}>
      <img
        src={vehicle.picture_url}
        alt={vehicle.car_type_name}
        className="vehicle-image"
        onError={(e) => {
          e.target.src = "/fallback.jpg";
        }}
        />
      <div className="vehicle-info">
        <h3>{vehicle.name}</h3>
        <p>
          <i className="fas fa-car-side"></i> {vehicle.car_type_name}
        </p>
        <p>
          <i className="fas fa-map-marker-alt"></i> {vehicle.location}
        </p>
        <p>
          <i className="fas fa-user-friends"></i> {vehicle.people_count} 
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;
