import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmDialog from "../Component/ConfirmDialog";
import "./VehicleDetails.css";
import EditButton from "../Component/EditButton";
import DeleteButton from "../Component/DeleteButton";
import { baseURL, CREATE_PICTURE_CAR, DELETE_PICTURE_CAR, DELETE_VEHICLY, EDIT_VEHICLE, GET_ALL_PICTURE, GET_VEHICLE_BYID, TOKEN, VEHICLE_OWNER } from "../Api/Api";
import VehicleDetailsSkeleton from "./VehicleDetailsSkeleton";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editPeopleCount, setEditPeopleCount] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const token = TOKEN;

  const fetchImages = () => {
    axios
      .get(`${baseURL}/${VEHICLE_OWNER}/${GET_ALL_PICTURE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setImages(res.data.images))
      .catch(() => setImages([]));
  };

  const fetchVehicle = () => {
    axios
      .get(`${baseURL}/${VEHICLE_OWNER}/${GET_VEHICLE_BYID}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVehicle(res.data.data);
        setEditDescription(res.data.data.car_discription || "");
        setEditPeopleCount(res.data.data.people_count || "");
        setIsChanged(false);
      });
  };

  useEffect(() => {
    fetchImages();
    fetchVehicle();
  }, [id]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDeleteVehicle = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteVehicle = () => {
    axios
      .delete(`${baseURL}/${VEHICLE_OWNER}/${DELETE_VEHICLY}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("The vehicle has been successfully deleted");
        navigate("/VehicleOwner/dashboard/vehiclys");
      })
      .catch(() => {
        toast.error("An error occurred while deleting the vehicle.");
      });
  };

  const handleDeleteImage = (imageId) => {
    axios
      .delete(
        `${baseURL}/${VEHICLE_OWNER}/${DELETE_PICTURE_CAR}/${imageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("The image has been successfully deleted");
        setTimeout(fetchImages, 800);
      })
      .catch(() => {
        toast.error("An error occurred while deleting the image.");
      });
  };

  const confirmDelete = () => {
    if (imageToDelete !== null) {
      handleDeleteImage(imageToDelete);
      setShowConfirm(false);
      setImageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setImageToDelete(null);
  };

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("vehicle_id", id);
    formData.append("picture", file);

    axios
      .post(
         `${baseURL}/${VEHICLE_OWNER}/${CREATE_PICTURE_CAR}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toast.success("The image has been uploaded successfully");
        fetchImages();
        setShowUploadModal(false);
      })
      .catch(() => {
        toast.error("An error occurred while uploading the image.");
      });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleChangeDescription = (e) => {
    setEditDescription(e.target.value);
    if (
      e.target.value !== vehicle.car_discription ||
      editPeopleCount !== vehicle.people_count
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleChangePeopleCount = (e) => {
    setEditPeopleCount(e.target.value);
    if (
      editDescription !== vehicle.car_discription ||
      e.target.value !== vehicle.people_count
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleSaveEdit = () => {
    axios
      .post(
        `${baseURL}/${VEHICLE_OWNER}/${EDIT_VEHICLE}/${id}`,
        {
          car_discription: editDescription,
          people_count: editPeopleCount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Vehicle data updated successfully");
        setShowEditModal(false);
        fetchVehicle();
      })
      .catch(() => {
        toast.error("An error occurred while updating the vehicle data.");
      });
  };

  if (!vehicle) return <div className="loading"><VehicleDetailsSkeleton/></div>;

  return (
    <div className="details-container">
      <div className="details-header">
        <h2>{vehicle.name}</h2>
        <p className="sub">{vehicle.car_type_name}</p>
      </div>

      <div className="carousel">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((img) => (
            <div className="image-wrapper" key={img.id}>
              <img src={img.path} alt={`vehicle-${img.id}`} />
              <button
                className="delete-icon-in-img"
                onClick={() => {
                  setImageToDelete(img.id);
                  setShowConfirm(true);
                }}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>

      <button
        className="upload-button"
        onClick={() => setShowUploadModal(true)}
      >
        Upload a new image
      </button>

      {showUploadModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowUploadModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Upload a picture of the vehicle</h3>

            <div
              className={`upload-area ${dragOver ? "drag-over" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current.click()}
              title="Drag image here or click to select file"
            >
              <p>Drag image here or click to select file</p>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files.length > 0)
                    handleFileUpload(e.target.files[0]);
                }}
              />
            </div>

            <button
              className="modal-close-btn"
              onClick={() => setShowUploadModal(false)}
            >
              Cancul
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Modify vehicle data</h3>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={editDescription}
              onChange={handleChangeDescription}
              rows={3}
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
              placeholder="Enter the vehicle description"
            />

            <label htmlFor="peopleCount">Number of people</label>
            <input
              id="peopleCount"
              type="number"
              min="1"
              value={editPeopleCount}
              onChange={handleChangePeopleCount}
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
              placeholder="Enter the number of people"
            />

            <button
              className="save-edit-btn"
              onClick={handleSaveEdit}
              disabled={!isChanged}
              style={{
                backgroundColor: isChanged ? "var(--color1)" : "var(--color6)",
                color: isChanged ? "white" : "var(--color3)",
                cursor: isChanged ? "pointer" : "not-allowed",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                transition: "background-color 0.3s",
                fontWeight: "bold",
              }}
            >
              Save the modification
            </button>

            <button
              className="modal-close-btn"
              onClick={() => setShowEditModal(false)}
              style={{
                marginTop: "10px",
                backgroundColor: "var(--color4)",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              cancel
            </button>
          </div>
        </div>
      )}

      <div className="details-info">
        <p>
          <i className="fas fa-users" style={{ marginLeft: "8px" }}></i>
          {vehicle.people_count}
        </p>
        <p>
          <i
            className="fas fa-map-marker-alt"
            style={{ marginLeft: "8px" }}
          ></i>
          {vehicle.location}
        </p>
        <p>
          <i className="fas fa-info-circle" style={{ marginLeft: "8px" }}></i>
          {vehicle.car_discription}
        </p>
      </div>

      <div className="action-buttons">
        <div className="" onClick={handleEdit}>
          <EditButton />
        </div>
          <div className="" onClick={handleDeleteVehicle}>

          <DeleteButton />
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this photo?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this vehicle?"
          onConfirm={confirmDeleteVehicle}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default VehicleDetails;
