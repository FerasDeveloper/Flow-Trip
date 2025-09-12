import React from "react";
import "./PackageElementDetailsSkeleton.css";

const PackageElementDetailsSkeleton = () => {
  return (
    <div className="skeletonContainer">
      <div className="skeletonSlider">
        <div className="skeletonImage"></div>
      </div>

      <div className="skeletonInfo">
        <div className="skeletonTitle"></div>
        <div className="skeletonType"></div>
        <div className="skeletonDescription"></div>
        <div className="skeletonDescription short"></div>
      </div>

      <div className="skeletonActions">
        <div className="skeletonBtn"></div>
        <div className="skeletonBtn"></div>
      </div>
    </div>
  );
};

export default PackageElementDetailsSkeleton;
