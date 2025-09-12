import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AddButton from "../Component/AddButton";
import axios from "axios";
import FlightCard from "../Component/FlightCard";
import { useNavigate } from "react-router-dom";
import { baseURL, GET_ALL_FlIGHTS, TOKEN } from "../Api/Api";
import Loader from "../Component/Loader";
import Cookies from "js-cookie"
const ViewFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = Cookies.get("token")||localStorage.getItem("token");
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/${GET_ALL_FlIGHTS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setFlights(response.data.flights);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);
  const handleAddFlight = () => {
    navigate("/addFlight");
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Your Flights</h2>
        </Col>
        <Col className="d-flex justify-content-end">
          <AddButton text="Add One" onClick={handleAddFlight} />
        </Col>
      </Row>

      <Row className="g-4">
        {flights.map((flight, index) => (
          <Col key={index} xs={12} sm={12} md={6} lg={4}>
            <FlightCard
              flightNumber={flight.flight_number}
              id={flight.id}
              price={flight.price}
              date={flight.date}
              offerPrice={flight.offer_price ? flight.offer_price : 0}
              from={flight.starting_point_location}
              to={flight.landing_point_location}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default ViewFlights;
