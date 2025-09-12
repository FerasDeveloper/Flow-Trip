import React from "react";
import "./PackageCardSkeleton.css";

const PackageCardSkeleton = () => {
  return (
    <div className="skeletonCard">
      <div className="skeletonImage shimmer"></div>
      <div className="skeletonContent">
        <div className="skeletonTitle shimmer"></div>
        <div className="skeletonText shimmer"></div>
        <div className="skeletonText shimmer short"></div>
        <div className="skeletonPrice shimmer"></div>
      </div>
    </div>
  );
};

export default PackageCardSkeleton;
