  import React, { useEffect, useState } from "react";
  import "./FlightReservation.css";
  import axios from "axios";
  import { useParams } from "react-router-dom";
  import { FaPlane } from "react-icons/fa";
  import { baseURL, GetFlightReservations, TOKEN } from "../Api/Api";
  import FlightReservationSkeleton from "../Component/FlightReservationSkeleton";

  export default function FlightReservation() {
    const token = TOKEN;
    const { id } = useParams();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;
    const [totalPages, setTotalPages] = useState(1);

    const getReservation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/${GetFlightReservations}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = Array.isArray(response.data.reservations) ? response.data.reservations : [];
        setReservations(data);
        setTotalPages(Math.ceil(data.length / perPage));
      } catch (error) {
        console.error(error);
        setReservations([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getReservation();
    }, []);

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentReservations = Array.isArray(reservations)
      ? reservations.slice(indexOfFirst, indexOfLast)
      : [];

    if (loading) return <FlightReservationSkeleton />;

    return (
      <div className="flight-reservation-container">
        <main className="flight-reservation-container-content">
          <section className="flight-reservation-container-title-section">
            <h2 className="flight-reservation-container-subtitle">
              Flight Reservations
            </h2>
            <p>Track all flight bookings</p>
          </section>

          <section className="stats">
            <div className="stat-card">
              <FaPlane />
              <div>
                <span>Total Bookings</span>
                <h3>{reservations.length}</h3>
              </div>
            </div>
          </section>

          <section className="reservations">
            <div className="reservations-header">
              <h3>Reservations</h3>
            </div>

            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Traveler Name</th>
                  <th>Flight Number</th>
                  <th>Seat Number</th>
                  <th>Reservation Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {currentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  currentReservations.map((res, index) => (
                    <tr key={index}>
                      <td>{res.traveler_name || "-"}</td>
                      <td>{res.national_number || "-"}</td>
                      <td>{res.seat_number || "-"}</td>
                      <td>
                        {res.created_at
                          ? new Date(res.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{res.price || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }
