import React from "react";
import "./ActivityCardSkeleton.css";

export default function ActivityCardSkeleton({ size = "small" }) {
  return (
    <div className={`activity-card ${size === "large" ? "large-card" : "small-card"} skeleton`}>
      <div className="activity-skel-img shimmer" />
      <div className="activity-skel-overlay">
        <div className="skel-line w-60 shimmer" />
        <div className="skel-line w-40 shimmer" />
        <div className="skel-line w-50 shimmer" />
      </div>
    </div>
  );
}
