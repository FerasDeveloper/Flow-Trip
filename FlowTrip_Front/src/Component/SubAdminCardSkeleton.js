import React from "react";
import "./SubAdminCardSkeleton.css";

const SubAdminCardSkeleton = () => {
  return (
    <div className="subadmin-skeleton-card">
      <div className="subadmin-skeleton-image shimmer"></div>
      <div className="subadmin-skeleton-description">
        <div className="subadmin-skeleton-title shimmer"></div>
        <div className="subadmin-skeleton-info">
          <div className="subadmin-skeleton-row">
            <div className="subadmin-skeleton-label shimmer"></div>
            <div className="subadmin-skeleton-value shimmer"></div>
          </div>
          <div className="subadmin-skeleton-row">
            <div className="subadmin-skeleton-label shimmer"></div>
            <div className="subadmin-skeleton-value shimmer"></div>
          </div>
        </div>
      </div>
      <div className="subadmin-skeleton-review shimmer"></div>
    </div>
  );
};

export default SubAdminCardSkeleton;
