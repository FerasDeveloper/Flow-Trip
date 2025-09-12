import React from "react";
import "./PackageRecordsSkeleton.css";

export default function PackageRecordsSkeleton({ count = 3 }) {
  return (
    <div className="recordsList-torismrecord">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-lines">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      ))}
    </div>
  );
}