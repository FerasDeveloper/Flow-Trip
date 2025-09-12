import React, { useEffect, useState } from "react";
import "./Vehiclys.css";
import axios from "axios";
import VehicleCard from "../Component/VehicleCard";
import VehicleSkeletonCard from "../Component/VehicleSkeletonCard";
import { useNavigate } from "react-router-dom";
import Button from "../Component/AddButton";
import { baseURL, GET_ALL_VICLYFORUSER, TOKEN, VEHICLE_OWNER } from "../Api/Api";

const Vehiclys = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = 7;
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  let TOKEN = getCookie("token");

  if (!TOKEN) {

    TOKEN = localStorage.getItem("token");
  }
  const token = TOKEN;

  useEffect(() => {
    axios
      .get(`${baseURL}/${VEHICLE_OWNER}/${GET_ALL_VICLYFORUSER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const allVehicles = res.data.data;
        const uniqueVehiclesMap = new Map();
        allVehicles.forEach((vehicle) => {
          if (!uniqueVehiclesMap.has(vehicle.vehicle_id)) {
            uniqueVehiclesMap.set(vehicle.vehicle_id, vehicle);
          }
        });
        const uniqueVehicles = Array.from(uniqueVehiclesMap.values());
        setVehicles(uniqueVehicles);
        setLoading(false);
      })
      .catch((err) => {
        console.error("An error occurred while fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="vehicle-container">
      <div className="vehicle-header col-12">
        <h2 className="vehicle-title">Your Vehiclys</h2>
        <Button onClick={() => navigate("/create-vehicle")}>+ Add vehicle</Button>
      </div>

      <div className="vehicle-grid col-lg-12">
        {loading
          ? Array(3).fill(null).map((_, i) => <VehicleSkeletonCard key={i} />)
          : vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.vehicle_id}
              vehicle={vehicle}
              onClick={() => navigate(`/vehicle/${vehicle.vehicle_id}`)}
            />
          ))}
      </div>
    </div>
  );
};

export default Vehiclys;
