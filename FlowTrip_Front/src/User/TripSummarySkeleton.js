import React from "react";
import "./TripSummarySkeleton.css";

export default function TripSummarySkeleton({ days = 5 }) {
  // Create array for the number of days
  const dayCards = Array.from({ length: days }, (_, index) => index + 1);

  return (
    <div className="summary-container">
      {/* Title Skeleton */}
      <div className="skeleton-title">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text skeleton-text-large"></div>
      </div>

      {/* Summary Skeleton */}
      <div className="skeleton-summary">
        <div className="skeleton-text skeleton-text-medium"></div>
        <div className="skeleton-text skeleton-text-medium skeleton-text-short"></div>
      </div>

      {/* Budget Box Skeleton */}
      <div className="skeleton-budget-box">
        <div className="skeleton-budget-content">
          <div className="skeleton-icon skeleton-icon-small"></div>
          <div className="skeleton-text skeleton-text-budget"></div>
        </div>
      </div>

      {/* Day Cards Skeleton */}
      {dayCards.map((day) => (
        <div key={day} className="skeleton-day-card">
          <div className="skeleton-day-header">
            <div className="skeleton-text skeleton-text-day"></div>
          </div>

          {/* Morning Session */}
          <div className="skeleton-session">
            <div className="skeleton-session-header">
              <div className="skeleton-icon skeleton-icon-small"></div>
              <div className="skeleton-text skeleton-text-session"></div>
            </div>
            <div className="skeleton-list">
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item skeleton-list-item-short"></div>
              <div className="skeleton-list-item"></div>
            </div>
          </div>

          {/* Afternoon Session */}
          <div className="skeleton-session">
            <div className="skeleton-session-header">
              <div className="skeleton-icon skeleton-icon-small"></div>
              <div className="skeleton-text skeleton-text-session"></div>
            </div>
            <div className="skeleton-list">
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item skeleton-list-item-short"></div>
            </div>
          </div>

          {/* Evening Session */}
          <div className="skeleton-session">
            <div className="skeleton-session-header">
              <div className="skeleton-icon skeleton-icon-small"></div>
              <div className="skeleton-text skeleton-text-session"></div>
            </div>
            <div className="skeleton-list">
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item skeleton-list-item-short"></div>
            </div>
          </div>

          {/* Notes Skeleton */}
          <div className="skeleton-notes">
            <div className="skeleton-notes-content">
              <div className="skeleton-icon skeleton-icon-tiny"></div>
              <div className="skeleton-text skeleton-text-notes"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Tips Box Skeleton */}
      <div className="skeleton-tips-box">
        <div className="skeleton-tips-header">
          <div className="skeleton-icon skeleton-icon-small"></div>
          <div className="skeleton-text skeleton-text-tips-title"></div>
        </div>
        <div className="skeleton-tips-list">
          <div className="skeleton-tip-item"></div>
          <div className="skeleton-tip-item skeleton-tip-item-short"></div>
          <div className="skeleton-tip-item"></div>
          <div className="skeleton-tip-item skeleton-tip-item-long"></div>
        </div>
      </div>

      {/* Back Button Skeleton */}
      <div className="skeleton-back-btn">
        <div className="skeleton-btn-content">
          <div className="skeleton-icon skeleton-icon-tiny"></div>
          <div className="skeleton-text skeleton-text-btn"></div>
        </div>
      </div>
    </div>
  );
}
