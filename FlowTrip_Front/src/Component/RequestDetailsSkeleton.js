import React from "react";
import "./RequestDetailsSkeleton.css";

const RequestDetailsSkeleton = () => {
  return (
    <div className="request-details-container">
      <div className="request-details-card">

        {/* العنوان */}
        <div className="skeleton skeleton-title"></div>

        {/* قسم معلومات المالك */}
        <section className="request-info-section">
          <div className="skeleton skeleton-subtitle"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
        </section>

        {/* قسم تفاصيل الطلب */}
        <section className="request-info-section">
          <div className="skeleton skeleton-subtitle"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
        </section>

        {/* الأزرار */}
        <div className="buttons-group">
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
        </div>

        {/* زر الرجوع */}
        <div className="skeleton skeleton-back"></div>
      </div>
    </div>
  );
};

export default RequestDetailsSkeleton;
