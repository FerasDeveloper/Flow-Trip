import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlanDetails.css";
import DeleteButton from "../Component/DeleteButton";
import EditButton from "../Component/EditButton"; 
import { baseURL, DELETE_PLANE, GET_SINGLE_PLANE, TOKEN } from "../Api/Api";


export default function PlanDetails() {
  const { planeId } = useParams();
  const navigate = useNavigate();
  const [planeData, setPlaneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
      const token = TOKEN;

  useEffect(() => {
    const fetchPlaneDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/${GET_SINGLE_PLANE}/${planeId}`, {
          headers: {
          Authorization: `Bearer ${token}`,
          }
        });
        setPlaneData(response.data);
      } catch (error) {
        console.error("Failed to fetch plane details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaneDetails();
  }, [planeId]);

  const handleDelete = async () => {
    try {
      const response = await axios.get(`${baseURL}/${DELETE_PLANE}/${planeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.message === "your plane deleted successfully") {
        setShowConfirmDelete(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/Airline/dashboard/showallplans");
        }, 2000);
      } else {
        console.error("Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting plane:", error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading plane details...</div>;
  }

  if (!planeData) {
    return <div className="error-message">Plane details not found.</div>;
  }

  const { plane, plane_type, image_url } = planeData;

  return (
    <div className="plan-details-container">
      <div className="plan-card">
        <div className="image-section">
          <img src={image_url} alt={`${plane_type} Diagram`} />
        </div>
        <div className="info-section">
          <h2>{plane_type}</h2>
          <p><strong>Seats Count:</strong> {plane.seats_count}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`status-badge ${
              plane.status.toLowerCase().includes('available') ? 'available-for-now' : 'not-available'
            }`}>
              {plane.status}
            </span>
          </p>

          <div className="action-buttons">
  <div onClick={() => navigate(`/editPlane/${planeId}`)}>
    <EditButton />
  </div>

  <div onClick={() => setShowConfirmDelete(true)}>
    <DeleteButton />
  </div>
</div>

        </div>
      </div>

      {showConfirmDelete && (
        <div className="modil-overlay">
          <div className="modil-box">
            <p>هل أنت متأكد أنك تريد حذف هذه الطائرة؟</p>
            <div className="modil-buttons">
              <button className="confirm-btn" onClick={handleDelete}>نعم، احذف</button>
              <button className="cancel-btn" onClick={() => setShowConfirmDelete(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modil-overlay">
          <div className="modil-box success">
            <p>✅ تم حذف الطائرة بنجاح</p>
          </div>
        </div>
      )}
    </div>
  );
}
