import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useLocation, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PackageElementDetails.css";
import EditButton from "../Component/EditButton";
import DeleteButton from "../Component/DeleteButton";
import ConfirmDialog from "../Component/ConfirmDialog";
import { colors } from "../Component/Color";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_PICTURE_ELEMENT, BASETOURISM, baseURL, DELETE_ELEMENT_PICTURE, DELETE_PACKAGE_ELEMENT, EDIT_PACKAGE_ELEMENT, GET_ELEMENT_PACKAGE_BYID, TOKEN } from "../Api/Api";
import PackageElementDetailsSkeleton from "./PackageElementDetailsSkeleton";

const PackageElementDetails = () => {
  const { state } = useLocation();
  const params = useParams();
  const id = state?.id || params?.id;
  const [element, setElement] = useState(null);
  const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836";
  const userType = localStorage.getItem("user_type");
  
  // Check role from both localStorage and cookies
  const getUserRole = () => {
    let role = localStorage.getItem("role");
    if (!role) {
      // If not in localStorage, check cookies
      const value = `; ${document.cookie}`;
      const parts = value.split(`; role=`);
      if (parts.length === 2) {
        role = parts.pop().split(';').shift();
      }
    }
    // Decode URL encoded values (e.g., Tourism%20Company -> Tourism Company)
    return role ? decodeURIComponent(role) : role;
  };
  
  const userRole = getUserRole();

  const token = `${TOKEN}`;
  

  // Debug: Check userRole value
  console.log("=== PackageElementDetails Debug ===");
  console.log("userRole:", userRole);
  console.log("userRole type:", typeof userRole);
  console.log("Is Tourism Company?", userRole === "Tourism Company");
  console.log("===================================");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", type: "", discription: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    adaptiveHeight: true,
  };

  useEffect(() => {
    setLoading(true);
    if (!id) return;
    const fetchElement = async () => {
      try {
        const response = await fetch(`${baseURL}/${BASETOURISM}/${GET_ELEMENT_PACKAGE_BYID}/${id}`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("element");
          console.log(data.data);
          setElement(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch element:", error);
      }
      setLoading(false);
    };
    fetchElement();
  }, [id, refresh]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !element?.id) return;
    const formData = new FormData();
    formData.append("picture", selectedFile);

    try {
      const response = await fetch(`${baseURL}/${BASETOURISM}/${ADD_PICTURE_ELEMENT}/${element.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("The image has been uploaded successfully");
        setShowUploadModal(false);
        setSelectedFile(null);
        setRefresh(prev => !prev);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred while uploading the image.");
    }
  };
  if (loading) return <PackageElementDetailsSkeleton />;
  if (!element) return <p>Element not found</p>;

  return (
    <div className="elementDetailsContainer">
      <div className="sliderContainer">
        <Slider {...sliderSettings} className="elementSlider">
          {element?.images && element.images.length > 0 ? (
            element.images.map((pic, index) => (
              <div key={index} className="sliderImageWrapper"
                style={{ position: "relative" }}
                onMouseEnter={() => {
                  console.log("Mouse enter - userRole:", userRole);
                  if (userRole === "Tourism Company") {
                    setDeleteImageId(pic.id);
                  }
                }}
                onMouseLeave={() => setDeleteImageId(null)}
              >
                <img
                  src={pic.path}
                  alt={`slide-${index}`}
                  className={`sliderImage${deleteImageId === pic.id ? " dimmed" : ""}`}
                />
                {deleteImageId === pic.id && userRole === "Tourism Company" && (
                  <button
                    className="deleteImageBtn"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(255,255,255,0.8)",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      padding: 6,
                      zIndex: 2
                    }}
                    onClick={() => setShowConfirm(pic.id)}
                  >
                    <i className="fa fa-trash" style={{ color: "#d32f2f", fontSize: 20 }} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="sliderImageWrapper">
              <img
                src={fallbackImage}
                alt="fallback"
                className="sliderImage"
              />
            </div>
          )}
        </Slider>
      </div>

      {userRole === "Tourism Company" && (
        <div className="imageActionButtons">
          <button
            className="imageControlBtn addBtn"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="fa fa-plus" /> Add a photo
          </button>
        </div>
      )}

      {showUploadModal && (
        <div className="modalOverlay" onClick={() => setShowUploadModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div
              className={`uploadArea ${dragActive ? "drag-active" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <button
                className="closeModalBtn"
                onClick={() => setShowUploadModal(false)}
              >
                <i className="fa fa-times" />
              </button>
              <p>Drag an image here or choose an image from your device.</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: "1rem" }}
              />
              {selectedFile && (
                <p style={{ marginTop: "0.5rem" }}>✔ {selectedFile.name}</p>
              )}
              <button onClick={handleUpload} className="uploadConfirmBtn" disabled={!selectedFile}>
                to lift
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete the photo?"
          onConfirm={async () => {
            try {
              const response = await fetch(`${baseURL}/${BASETOURISM}/${DELETE_ELEMENT_PICTURE}/${showConfirm}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (response.ok) {
                setShowConfirm(false);
                setRefresh(prev => !prev);
                toast.success("The image has been successfully deleted");
              } else {
                toast.error("Failed to delete the image");
              }
            } catch (error) {
              alert("An error occurred while deleting the image.");
            }
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="elementInfo">
        <h1 className="elementName">{element?.name}</h1>
        <p className="elementType">type: {element?.type}</p>
        <p className="elementDescription">{element?.discription || element?.description}</p>
      </div>

      {userRole === "Tourism Company" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
          <div onClick={() => {
            setEditValues({
              name: element?.name || "",
              type: element?.type || "",
              discription: element?.discription || element?.description || ""
            });
            setShowEditModal(true);
          }}>
            <EditButton />
          </div>
          <div onClick={() => setShowDeleteDialog(true)}>
            <DeleteButton />
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this item?"
          onConfirm={async () => {
            try {
              const res = await fetch(`${baseURL}/${BASETOURISM}/${DELETE_PACKAGE_ELEMENT}/${element.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (res.ok) {
                setShowDeleteDialog(false);
                toast.success("The item was deleted successfully");
                setTimeout(() => { window.location.href = `/package/${element.package_id}`; }, 1200);
              } else {
                toast.error("Failed to delete item");
              }
            } catch {
              alert("An error occurred while deleting.");
            }
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      {showEditModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: colors.color7,
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }} onClick={() => setShowEditModal(false)}>
          <div style={{
            background: colors.color5,
            borderRadius: 16,
            padding: 32,
            minWidth: 320,
            boxShadow: "0 0 16px #0002",
            position: "relative"
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.color1, marginBottom: 16 }}>Modify item data</h2>
            <label style={{ color: colors.color2, fontWeight: "bold" }}>name</label>
            <input
              style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${colors.color4}`, marginBottom: 12 }}
              value={editValues.name}
              onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
            />
            <label style={{ color: colors.color2, fontWeight: "bold" }}>type</label>
            <input
              style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${colors.color4}`, marginBottom: 12 }}
              value={editValues.type}
              onChange={e => setEditValues(v => ({ ...v, type: e.target.value }))}
            />
            <label style={{ color: colors.color2, fontWeight: "bold" }}>Description</label>
            <textarea
              style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${colors.color4}`, marginBottom: 16, minHeight: 60 }}
              value={editValues.discription}
              onChange={e => setEditValues(v => ({ ...v, discription: e.target.value }))}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                style={{
                  background: colors.color2,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 24px",
                  fontWeight: "bold",
                  cursor: (editValues.name !== (element?.name || "") || editValues.type !== (element?.type || "") || editValues.discription !== (element?.discription || element?.description || "")) && !editLoading ? "pointer" : "not-allowed",
                  opacity: (editValues.name !== (element?.name || "") || editValues.type !== (element?.type || "") || editValues.discription !== (element?.discription || element?.description || "")) && !editLoading ? 1 : 0.6
                }}
                disabled={!(editValues.name !== (element?.name || "") || editValues.type !== (element?.type || "") || editValues.discription !== (element?.discription || element?.description || "")) || editLoading}
                onClick={async () => {
                  setEditLoading(true);
                  try {
                    const res = await fetch(`${baseURL}/${BASETOURISM}/${EDIT_PACKAGE_ELEMENT}/${element.id}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        name: editValues.name,
                        type: editValues.type,
                        discription: editValues.discription
                      })
                    });
                    if (res.ok) {
                      setShowEditModal(false);
                      setRefresh(prev => !prev);
                      toast.success("The data has been updated successfully");
                    } else {
                      toast.error("Failed to update data");
                    }
                  } catch {
                    alert("An error occurred while updating");
                  }
                  setEditLoading(false);
                }}
              >
                {editLoading ? "...updating" : "to update"}
              </button>
              <button
                style={{
                  background: colors.color4,
                  color: colors.color1,
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 24px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
                onClick={() => setShowEditModal(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default PackageElementDetails;
