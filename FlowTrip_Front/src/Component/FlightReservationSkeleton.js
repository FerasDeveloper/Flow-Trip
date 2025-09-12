import React from "react";
import "./FlightReservationSkeleton.css";

export default function FlightReservationSkeleton() {
  return (
    <div className="flight-reservation-container">
      <main className="flight-reservation-container-content">
        <section
          className="flight-reservation-container-title-section"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <div
            className="skeleton skeleton-title"
            style={{ width: "200px", height: "28px" }}
          ></div>
          <div
            className="skeleton skeleton-text"
            style={{ width: "150px", height: "18px" }}
          ></div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div
              className="skeleton skeleton-icon"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            ></div>
            <div style={{ marginLeft: "10px" }}>
              <div
                className="skeleton skeleton-text"
                style={{ width: "80px", height: "14px" }}
              ></div>
              <div
                className="skeleton skeleton-text"
                style={{ width: "40px", height: "20px", marginTop: "4px" }}
              ></div>
            </div>
          </div>
        </section>

        <section className="reservations">
          <div className="reservations-header">
            <div
              className="skeleton skeleton-text"
              style={{ width: "180px", height: "24px" }}
            ></div>
          </div>

          <table className="reservations-table">
            <thead>
              <tr>
                {[
                  "Traveler Name",
                  "Flight Number",
                  "Seat Number",
                  "Reservation Date",
                  "Price",
                ].map((_, i) => (
                  <th key={i}>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "80px", height: "16px" }}
                    ></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, row) => (
                <tr key={row}>
                  {Array.from({ length: 5 }).map((_, col) => (
                    <td key={col}>
                      <div
                        className="skeleton skeleton-text"
                        style={{ width: "80px", height: "16px" }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton skeleton-button"
                style={{ width: "50px", height: "32px", marginRight: "5px" }}
              ></div>
            ))}
          </div>
        </section>
      </main>

      <footer className="flight-reservation-container-footer">
        <div
          className="skeleton skeleton-text"
          style={{ width: "180px", height: "16px", marginBottom: "8px" }}
        ></div>
        <div className="footer-links" style={{ display: "flex", gap: "10px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-text"
              style={{ width: "60px", height: "16px" }}
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
}
