import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PlaneCard from "./PlaneCard";
import "react-toastify/dist/ReactToastify.css";
import "../Component/OwnerCard.css";
import { baseURL, GET_ALL_PLANES, TOKEN } from "../Api/Api";
import { Col, Container, Row } from "react-bootstrap";
import AddButton from "../Component/AddButton";
import AddPlane from "./AddPlane";

export default function ShowAllPlans() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlaneModal, setShowAddPlaneModal] = useState(false);
  const navigate = useNavigate();
  const token = TOKEN;

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await axios.get(`${baseURL}/${GET_ALL_PLANES}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allPlanes = response.data?.planes;

        if (Array.isArray(allPlanes)) {
          setPlanes(allPlanes);
        } else {
          toast.warning("No valid planes array found.");
          setPlanes([]);
        }
      } catch (error) {
        toast.error("Failed to fetch planes data");
        setPlanes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  if (loading) {
    return <div className="owner-loading">Loading planes...</div>;
  }

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1
            className="title"
            style={{ textAlign: "center", margin: "30px 0", color: "#1e3a8a" }}
          >
            ✈️ All Available Planes
          </h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <AddButton
            text="Add One"
            onClick={() => {
              setShowAddPlaneModal(true);
            }}
          />
        </Col>
      </Row>

      <Row className="g-4">
        {planes.length === 0 ? (
          <div className="owner-error">No planes available.</div>
        ) : (
          <div className="owner-list-container">
            {planes.map(({ plane, plane_type }, index) => (
              <Col key={index} xs={12} sm={12} md={6} lg={4}>
                <PlaneCard
                  key={plane.id}
                  plane={plane}
                  plane_type={plane_type}
                  onClick={() => navigate(`/showallplans/${plane.id}`)}
                />
              </Col>
            ))}
          </div>
        )}
      </Row>
      {showAddPlaneModal && (
        <AddPlane onClose={() => setShowAddPlaneModal(false)} />
      )}
    </Container>
  );
}
