import React from "react";
import "./RequestCardSkeleton.css";

const RequestCardSkeleton = () => {
  return (
    <div className="request-card skeleton-card">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-subtitle"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );
};

export default RequestCardSkeleton;
