import React from "react";
import "./ShowRecordsCardSkeleton.css";

const ShowRecordsCardSkeleton = ({ hasHeader = false, hasFooter = false }) => {
  return (
    <div className="show-records-skeleton-card">
      {hasHeader && (
        <div className="show-records-skeleton-header">
          <div className="show-records-skeleton-avatar shimmer"></div>
          <div className="show-records-skeleton-user-info">
            <div className="show-records-skeleton-name shimmer"></div>
            <div className="show-records-skeleton-email shimmer"></div>
          </div>
        </div>
      )}
      
      <div className="show-records-skeleton-content">
        <div className="show-records-skeleton-row">
          <div className="show-records-skeleton-info-item">
            <div className="show-records-skeleton-label shimmer"></div>
            <div className="show-records-skeleton-value shimmer"></div>
          </div>
          <div className="show-records-skeleton-info-item">
            <div className="show-records-skeleton-label shimmer"></div>
            <div className="show-records-skeleton-value shimmer"></div>
          </div>
        </div>
        
        <div className="show-records-skeleton-row">
          <div className="show-records-skeleton-info-item">
            <div className="show-records-skeleton-label shimmer"></div>
            <div className="show-records-skeleton-value shimmer"></div>
          </div>
          <div className="show-records-skeleton-info-item">
            <div className="show-records-skeleton-label shimmer"></div>
            <div className="show-records-skeleton-value shimmer"></div>
          </div>
        </div>
        
        <div className="show-records-skeleton-row">
          <div className="show-records-skeleton-info-item">
            <div className="show-records-skeleton-label shimmer"></div>
            <div className="show-records-skeleton-value shimmer long"></div>
          </div>
        </div>
      </div>
      
      {hasFooter && (
        <div className="show-records-skeleton-footer">
          <div className="show-records-skeleton-button shimmer"></div>
        </div>
      )}
    </div>
  );
};

export default ShowRecordsCardSkeleton;
