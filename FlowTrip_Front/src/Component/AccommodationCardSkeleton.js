import React from "react";
import "./AccommodationCardSkeleton.css";

export default function AccommodationCardSkeleton() {
  return (
    <div className="accommodation-card skeleton">
      <div className="acc-skel-img shimmer" />
      <div className="accommodation-info">
        <div className="skel-line w-70 shimmer" />
        <div className="skel-line w-50 shimmer" />
        <div className="skel-line w-40 shimmer" />
      </div>
    </div>
  );
}
