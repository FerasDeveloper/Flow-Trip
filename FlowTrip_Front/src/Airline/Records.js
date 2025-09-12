import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL, GetAllReservations, SearchReservationsByName, TOKEN } from "../Api/Api";
import "./Records.css";
import ExpandableSearch from "../Component/ExpandableSearch";

const SkeletonRow = () => {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
      <td>
        <div className="skeleton skeleton-text"></div>
      </td>
    </tr>
  );
};

const Records = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalReservations, setOriginalReservations] = useState([]);
  const token = TOKEN;
  const navigate = useNavigate();

  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/${GetAllReservations}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data.reservations);
      setOriginalReservations(response.data.reservations);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReservations(originalReservations);
  };


  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      setReservations(originalReservations);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/${SearchReservationsByName}`,
        { name: searchTerm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(response.data.reservations);
    } catch (err) {
      console.error("Failed to search reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/flight/${id}`);
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  return (
    <Container fluid className="py-4 airline-reservations">
      <Row className="mb-4">
        <Col>
          <h2 className="title">Airline Reservations</h2>
        </Col>
      </Row>

      <Row className="d-flex justify-content-center align-item-center">
        <ExpandableSearch handleSearch={handleSearch} onReset={handleReset} />
      </Row>

      <Row>
        <Col>
          <div className="table-wrapper shadow-sm rounded">
            <Table hover responsive className="reservation-table mb-0">
              <thead className="table-header">
                <tr>
                  <th>Traveler Name</th>
                  <th>National Number</th>
                  <th>Flight Number</th>
                  <th>Start Date</th>
                  <th>Seat Number</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(6)
                    .fill()
                    .map((_, index) => <SkeletonRow key={index} />)
                ) : reservations.length > 0 ? (
                  reservations.map((item, index) => {
                    const reservation = item.reservation || item;
                    const flight = item.flight_details || {};
                    return (
                      <tr
                        key={index}
                        onClick={() => handleRowClick(flight.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{reservation.traveler_name}</td>
                        <td>{reservation.national_number}</td>
                        <td>{flight.flight_number}</td>
                        <td>{flight.date}</td>
                        <td>{reservation.seat_number}</td>
                        <td>${reservation.price}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center no-data">
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Records;
