// SkeletonRecordsCard.js
import React from "react";
import "./SkeletonRecordsCard.css";

function SkeletonRecordsCard() {
  return (
    <div className="skeletonCard">
      <div className="skeletonImage"></div>
      <div className="skeletonContent">
        <div className="skeletonLine short"></div>
        <div className="skeletonLine"></div>
        <div className="skeletonFooter">
          <div className="skeletonBadge"></div>
          <div className="skeletonBadge"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonRecordsCard;
