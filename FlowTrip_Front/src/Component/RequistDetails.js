import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./RequistDetails.css";
import Button from "./Buttonconferm";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import ConfirmDialog from "./ConfirmDialog";
import CategoryPopup from "../Admin/CategoryPopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ACCEPT_REQUEST,
  baseURL,
  DELETE_REQUEST,
  SHOW_REQUEST,
  TOKEN,
} from "../Api/Api";
import RequestDetailsSkeleton from "./RequestDetailsSkeleton";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // <<<<<<< HEAD
  //   const token = localStorage.getItem("token");
  // =======
  const token = TOKEN;
  // >>>>>>> 8d3da609a625411d2016f43b589b4bae035e3447

  useEffect(() => {
    const fetchDetails = async () => {
      // Check if token exists
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/${SHOW_REQUEST}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data.data) {
          setRequest(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching request details:", err);

        if (err.response && err.response.status === 401) {
          console.error("Token is invalid or expired");
          toast.error("Authentication failed. Please login again.");
        } else {
          toast.error("Failed to load order details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token]);

  const handleConfirm = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    try {
      await axios.get(`${baseURL}/${ACCEPT_REQUEST}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order confirmed successfully");
      setTimeout(() => navigate("/Admin/dashboard/requist"), 1500);
    } catch (error) {
      console.error("Error confirming request:", error);

      if (error.response && error.response.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to confirm the order.");
      }
    }
  };

  const handleActivityUpdate = (newActivity) => {
    setRequest((prev) => ({
      ...prev,
      request: {
        ...prev.request,
        activity_name: newActivity,
      },
    }));
    toast.success("The activity has been updated successfully");
  };

  const handleDelete = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    try {
      await axios.get(`${baseURL}/${DELETE_REQUEST}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("The request has been successfully deleted");
      setTimeout(() => navigate("/admin/dashboard/requist"), 1500);
    } catch (err) {
      console.error("Error deleting request:", err);

      if (err.response && err.response.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to delete request.");
      }
    }
  };

  const handleContact = () => {
    if (!email) {
      toast.error("Email address not available for this request.");
      return;
    }

    // Create email subject and body
    const subject = encodeURIComponent(
      `Regarding your request: ${req.business_name}`
    );
    const body = encodeURIComponent(
      `Hello,\n\nI am contacting you regarding your request for "${req.business_name}".\nPlease Send ....,\n\nAdmin Team`
    );

    // Open default email client
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      window.open(mailtoLink, "_blank");
    } catch (error) {
      console.error("Error opening email client:", error);
      toast.error(
        "Failed to open email client. Please copy the email address manually."
      );
    }
  };

  if (loading) return <RequestDetailsSkeleton />;
  if (!request) return <p className="error">Failed to load data.</p>;

  const { request: req, user_name, email, phone_number } = request;

  return (
    <div className="request-details-container">
      <div className="request-details-card">
        <h1 className="request-title">{req.business_name}</h1>

        <section className="request-info-section">
          <h3 className="request-info-title">Owner Information</h3>
          <p className="request-info-text">Name: {user_name}</p>
          <p className="request-info-text">Email: {email}</p>
          <p className="request-info-text">Phone: {phone_number}</p>
        </section>

        {/* <section className="request-info-section">
        </section> */}

        <h3 className="request-info-title">Request Details</h3>
        <section className="request-section">
          <h3 className="section-title">Owner Information</h3>
          <p className="section-text">Name: {user_name}</p>
          <p className="section-text">Email: {email}</p>
          <p className="section-text">Phone: {phone_number}</p>
        </section>

        <section className="request-section">
          <h3 className="section-title">Request Details</h3>
          <p>
            <strong className="field-label">Description:</strong>{" "}
            {req.description}
          </p>
          <p>
            <strong className="field-label">Location:</strong> {req.location}
          </p>
          <p>
            <strong className="field-label">Category:</strong>{" "}
            {req.owner_category_id}
          </p>
          <p>
            <strong className="field-label">Activity:</strong>{" "}
            {req.activity_name || "Not specified"}
          </p>
          <p>
            <strong className="field-label">Accommodation:</strong>{" "}
            {req.accommodation_type || "Not specified"}
          </p>
        </section>

        <div className="buttons-group">
          <Button onClick={handleConfirm} />
          {/* <div onClick={() => setShowCategoryPopup(true)}>
            <EditButton />
          </div> */}
          {req.owner_category_id === 5 && (
            <div onClick={() => setShowCategoryPopup(true)}>
              <EditButton />
            </div>
          )}

          <div onClick={() => setShowDeleteConfirm(true)}>
            <DeleteButton />
          </div>
          <button
            onClick={handleContact}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            التواصل
          </button>
        </div>

        <button className="back-button" onClick={() => window.history.back()}>
          Back to Requests
        </button>
      </div>

      {showCategoryPopup && (
        <CategoryPopup
          onClose={() => setShowCategoryPopup(false)}
          requestId={id}
          onSuccessUpdate={handleActivityUpdate}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this request?"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDelete();
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RequestDetails;
