import React from "react";
import "./PackageDetailsLoader.css";

const PackageDetailsLoader = () => {
  return (
    <div className="skeletonContainer">
      <div className="skeleton skeletonSlider"></div>

      <div className="skeletonBox">
        <div className="skeleton skeletonTitle"></div>
        <div className="skeleton skeletonText"></div>
        <div className="skeleton skeletonText short"></div>
      </div>

      <div className="skeletonBox">
        <div className="skeleton skeletonSubtitle"></div>
        <div className="skeletonGrid">
          {[...Array(4)].map((_, i) => (
            <div className="skeleton skeletonCard" key={i}></div>
          ))}
        </div>
      </div>

      <div className="skeletonFooter">
        <div className="skeleton skeletonButton"></div>
      </div>
    </div>
  );
};

export default PackageDetailsLoader;
