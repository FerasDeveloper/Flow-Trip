import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PlaneCard from "./PlaneCard"; 
import 'react-toastify/dist/ReactToastify.css';
import "../Component/OwnerCard.css"; 
import { baseURL, GET_ALL_PLANES, TOKEN } from "../Api/Api";

export default function ShowAllPlans() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
      const token = TOKEN;

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await axios.get(`${baseURL}/${GET_ALL_PLANES}`, {
          headers: {
          Authorization: `Bearer ${token}`,
          }
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
    <div>
      <ToastContainer />
      <h1 className="title" style={{ textAlign: "center", margin: "30px 0", color: "#1e3a8a" }}>
        ✈️ All Available Planes
      </h1>

      {planes.length === 0 ? (
        <div className="owner-error">No planes available.</div>
      ) : (
        <div className="owner-list-container">
          {planes.map(({ plane, plane_type }) => (
            <PlaneCard
              key={plane.id}
              plane={plane}
              plane_type={plane_type}
              onClick={() => navigate(`/plans/showallplans/${plane.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
