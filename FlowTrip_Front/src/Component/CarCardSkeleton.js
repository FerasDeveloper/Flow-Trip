import React from "react";
import "./CarCardSkeleton.css";

export default function CarCardSkeleton() {
  return (
    <div className="car-skel-card">
      <div className="car-skel-body">
        <div className="car-skel-row header">
          <div className="car-skel-title shimmer" />
          <div className="car-skel-btn shimmer" />
        </div>

        <div className="car-skel-tags">
          <span className="car-skel-chip shimmer" />
        </div>

        <div className="car-skel-line shimmer" />
        <div className="car-skel-line shimmer" />
        <div className="car-skel-line shimmer" />
        <div className="car-skel-line shimmer" />
        <div className="car-skel-line shimmer short" />
      </div>
    </div>
  );
}
