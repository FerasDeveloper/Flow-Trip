import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestCard from "../Component/RequestCard";
import { baseURL, GET_ALL_REQUESTS, TOKEN } from "../Api/Api";
import RequestCardSkeleton from "../Component/RequestCardSkeleton";

const Requist = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchRequests = async () => {
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/${GET_ALL_REQUESTS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        console.log(token);
        if (response.data && response.data.data) {
          setRequests(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);

        if (error.response && error.response.status === 401) {
          console.error("Token is invalid or expired");
          // Optionally redirect to login page
          // window.location.href = "/auth";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "var(--color5)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "var(--color1)", marginBottom: "1.5rem" }}>
        Current orders
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {loading ? (
          <>
            <RequestCardSkeleton />
            <RequestCardSkeleton />
            <RequestCardSkeleton />
            <RequestCardSkeleton />
          </>
        ) : (
          requests.map((item) => {
            const { id, description, business_name } = item.request;
            const ownerCategory = item.request.activity_name;
            return (
              <RequestCard
                key={id}
                id={id}
                businessName={business_name}
                ownerCategory={ownerCategory}
                description={description}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Requist;