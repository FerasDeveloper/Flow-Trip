import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BookingsSkeleton() {
  // Render 6 skeleton cards to fill the grid nicely
  return (
    <SkeletonTheme baseColor="#eef2f7" highlightColor="#f6f9fc">
      <div className="bookings-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="booking-card">
            <div className="booking-header">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={140} height={22} />
            </div>

            <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
            <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />

            {/* Type-specific blocks (image block for package / lines for flight) */}
            <Skeleton width="70%" height={14} style={{ marginBottom: 8 }} />
            <Skeleton width="50%" height={14} style={{ marginBottom: 12 }} />

            <Skeleton height={160} style={{ borderRadius: 12 }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}