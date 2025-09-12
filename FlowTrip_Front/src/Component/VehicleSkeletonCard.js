import React from "react";
import "./VehicleSkeletonCard.css";

const VehicleSkeletonCard = () => {
  return (
    <div className="vehicle-skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line short"></div>
        <div className="skeleton skeleton-line"></div>
      </div>
    </div>
  );
};

export default VehicleSkeletonCard;
