import React from "react";
import "./VehicleDetailsSkeleton.css";

const VehicleDetailsSkeleton = () => {
  return (
    <div className="details-skeleton-container">
      <div className="details-header-skeleton">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>

      <div className="carousel-skeleton">
        <div className="skeleton skeleton-image"></div>
        <div className="skeleton skeleton-image"></div>
        <div className="skeleton skeleton-image"></div>
      </div>

      <div className="details-info-skeleton">
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line short"></div>
        <div className="skeleton skeleton-line"></div>
      </div>

      <div className="action-buttons-skeleton">
        <div className="skeleton skeleton-button"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
};

export default VehicleDetailsSkeleton;
