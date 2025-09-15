import { useEffect, useState } from "react";
import { baseURL, TOKEN } from "../Api/Api";
import "./GetEvaluation.css"; 
import EvaluationSkeleton from "./EvaluationSkeleton";

export default function GetEvaluation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetch(`${baseURL}/GetEvaluation`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch evaluation data");
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // if (loading) return <p className="loading">Loading...</p>;
  if (loading) return <EvaluationSkeleton />;
  if (error) return <p className="error">{error}</p>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const remainder = rating - fullStars;

    let stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: "#FFD700", fontSize: "22px" }}>
          ★
        </span>
      );
    }

    if (remainder > 0.4 && remainder < 0.7) {
      stars.push(
        <span
          key="half"
          style={{
            background: "linear-gradient(to right, #FFD700 50%, #ccc 50%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: "22px",
          }}
        >
          ★
        </span>
      );
    } else if (remainder >= 0.7) {
      stars.push(
        <span key="extra-full" style={{ color: "#FFD700", fontSize: "22px" }}>
          ★
        </span>
      );
    }

    while (stars.length < 5) {
      stars.push(
        <span
          key={`empty-${stars.length}`}
          style={{ color: "#ccc", fontSize: "22px" }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="evaluation-container">
      <h2>Get Evaluation</h2>

      <div className="average-box">
        <div className="average-item">
          <div className="average-item-value">
            {data?.average_rating ?? "-"}
          </div>
          <div className="average-item-label">Average Rating</div>
        </div>
        <div className="average-item">
          <div className="average-item-value">{data?.floor_average ?? "-"}</div>
          <div className="average-item-label">Floor Average</div>
        </div>
      </div>

      <div className="cards-grid">
        {data?.ratings && data.ratings.length > 0 ? (
          data.ratings.map((item, index) => (
            <div key={index} className="evaluation-card">
              <p className="user-name">{item.user.name}</p>
              <p className="user-phone">{item.user.phone_number}</p>
              <p className="user-stars">{renderStars(item.rate)}</p>
            </div>
          ))
        ) : (
          <p className="no-rating">No rating yet</p>
        )}
      </div>
    </div>
  );
}
