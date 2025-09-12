import React from "react";
import "../Component/OwnerCard.css"; 

const PlaneCard = ({ plane, plane_type, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div
        className="card-image"
        style={{
  backgroundImage: `url(http://127.0.0.1:8000/storage/plane_shape_diagram/${encodeURIComponent(plane.plane_shape_diagram)})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}}

      ></div>

      <div className="card-description">
        <p className="text-title">{plane_type}</p>
      </div>

      <div className="card-review">View</div>
    </div>
  );
};

export default PlaneCard;
