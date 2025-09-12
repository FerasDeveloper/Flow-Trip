import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./AddVehicleImages.css";
import { baseURL, CREATE_PICTURE_CAR, GET_ALL_PICTURE, TOKEN, VEHICLE_OWNER } from "../Api/Api";

const AddVehicleImages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
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
    .get(`${baseURL}/${VEHICLE_OWNER}/${GET_ALL_PICTURE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setImages(res.data.images || []);
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        setImages([]);
      } else {
        toast.error("An error occurred while fetching images.");
      }
    });
}, [id]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        setTimeout(() => {
          axios
            .get(`${baseURL}/${VEHICLE_OWNER}/${GET_ALL_PICTURE}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setImages(res.data.images || []));
        }, 500);
      })
      .catch(() => {
        toast.error("Failed to upload image");
      });
  };

  return (
    <div className="addvehicle-container">
      <h2>Add vehicle photos</h2>

      <button
        className="addvehicle-upload-btn animated-button"
        onClick={() => fileInputRef.current.click()}
      >
        Select an image from the device
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="addvehicle-preview-images">
        {images.length === 0 ? (
          <p className="no-images-text">There are no photos currently</p>
        ) : (
          images.map((img) => (
            <img key={img.id} src={img.path} alt={`vehicle-${img.id}`} />
          ))
        )}
      </div>

      <div className="addvehicle-buttons">
        <button
          className="skip-btn animated-button"
          onClick={() => navigate("/VehicleOwner/dashboard/vehiclys")}
        >
          Skipe
        </button>

        {images.length > 0 && (
          <button
            className="finish-btn animated-button"
            onClick={() => navigate("/VehicleOwner/dashboard/vehiclys")}
          >
           Finish
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddVehicleImages;
