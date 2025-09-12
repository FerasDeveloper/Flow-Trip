// src/pages/ActivitySkeleton.js
import React from "react";
import "./ActivitySkeleton.css";

const ActivitySkeleton = () => {
  return (
    <div className="activity-page">

      {/* الكروت Skeleton */}
      <div className="activity-row">
        {Array.from({ length: 16 }).map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-delete"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySkeleton;
