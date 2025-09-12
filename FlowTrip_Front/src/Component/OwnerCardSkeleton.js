import React from "react";
import "./OwnerCardSkeleton.css";

const OwnerCardSkeleton = () => {
  return (
    <div className="owner-skeleton-card">
      <div className="owner-skeleton-image shimmer"></div>
      <div className="owner-skeleton-description">
        <div className="owner-skeleton-title shimmer"></div>
        <div className="owner-skeleton-info">
          <div className="owner-skeleton-row">
            <div className="owner-skeleton-label shimmer"></div>
            <div className="owner-skeleton-value shimmer"></div>
          </div>
          <div className="owner-skeleton-row">
            <div className="owner-skeleton-label shimmer"></div>
            <div className="owner-skeleton-value shimmer"></div>
          </div>
          <div className="owner-skeleton-row">
            <div className="owner-skeleton-label shimmer"></div>
            <div className="owner-skeleton-value shimmer"></div>
          </div>
        </div>
      </div>
      <div className="owner-skeleton-review shimmer"></div>
    </div>
  );
};

export default OwnerCardSkeleton;
