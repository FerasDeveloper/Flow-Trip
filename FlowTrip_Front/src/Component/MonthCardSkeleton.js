import React from "react";
import "./MonthCardSkeleton.css";

const MonthCardSkeleton = () => {
  return (
    <div className="month-skeleton-card">
      <div className="month-skeleton-header">
        <div className="month-skeleton-title shimmer"></div>
      </div>
      <div className="month-skeleton-content">
        <div className="month-skeleton-text shimmer"></div>
      </div>
    </div>
  );
};

export default MonthCardSkeleton;
