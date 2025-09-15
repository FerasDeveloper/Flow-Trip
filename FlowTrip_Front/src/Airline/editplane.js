import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditPlane.css";
import { baseURL, EDIT_PLANE, GET_SINGLE_PLANE, TOKEN } from "../Api/Api";

export default function EditPlane() {
  const { planeId } = useParams();
  const navigate = useNavigate();
  const token = TOKEN;

  const [planeData, setPlaneData] = useState({
    plane_type_id: "",
    seats_count: "",
    status: "",
    image_url: "",
  });

  const [oldImageFile, setOldImageFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [planeTypes, setPlaneTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPlaneTypes();
  }, []);
  
  useEffect(() => {
    const fetchPlane = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/${GET_SINGLE_PLANE}/${planeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { plane, image_url } = res.data;
        setPlaneData({
          plane_type_id: plane.plane_type_id.toString(),
          seats_count: plane.seats_count.toString(),
          status: plane.status,
          image_url,
        });
      } catch (err) {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchPlane();
  }, [planeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaneData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPlaneData((prev) => ({
          ...prev,
          image_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("plane_type_id", Number(planeData.plane_type_id));
      formData.append("seats_count", Number(planeData.seats_count));
      formData.append("status", planeData.status);

      if (newImageFile) {
        formData.append("plane_shape_diagram", newImageFile);
      } else {
        formData.append("existing_image_url", planeData.image_url);
      }

      const res = await axios.post(
        `${baseURL}/${EDIT_PLANE}/${planeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "your plane updeted successfully") {
        navigate("/Airline/dashboard/showallplans");
      } else {
        setError("Failed to update, please try again later");
      }
    } catch (err) {
      if (err.response) {
        setError("Server error " + JSON.stringify(err.response.data));
      } else {
        setError("Somthing went wrong while updating");
      }
    } finally {
      setSaving(false);
    }
  };
  const fetchPlaneTypes = async () => {
    setTypesLoading(true);
    setTypesError("");
    try {
      const token = TOKEN;
      // غيّر المسار حسب الـ API عندك لو مختلف:
      const res = await axios.get(`${baseURL}/GetAllPlaneTypes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = res?.data?.data ?? res?.data ?? {};
      // محاولات مرنة لاستخراج المصفوفة (حسب اسم الحقل عندك في الـ API)
      const list =
        body?.plane_types ??
        body?.types ??
        body?.data ??
        (Array.isArray(body) ? body : []);

      setPlaneTypes(Array.isArray(list) ? list : []);
      if (!Array.isArray(list) || list.length === 0) {
        setTypesError("لا توجد أنواع طائرات متاحة.");
      }
    } catch (e) {
      setTypesError("فشل تحميل أنواع الطائرات.");
      setPlaneTypes([]);
    } finally {
      setTypesLoading(false);
    }
  };
  if (loading) return <p>Loading the plane Details</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="edit-plane-container">
      <h2 className="edit-plane-title">✈️ Edit Plane Details</h2>

      <div className="image-container">
        <img
          src={
            planeData.image_url ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt="Plane"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <p className="image-text"> Click on the image to change it</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Aircraft type:
          <select
            name="plane_type_id"
            value={planeData.plane_type_id}
            onChange={handleChange}
            required
            disabled={typesLoading || !!typesError}
          >
            <option value="" disabled>
              {typesLoading ? "Loading types..." : typesError || "Select type"}
            </option>
            {planeTypes.map((t) => {
              const id = t.id ?? t.type_id ?? t.plane_type_id;
              const name = t.name ?? t.type_name ?? t.title ?? `Type ${id}`;
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          Seats Count:
          <input
            type="number"
            name="seats_count"
            value={planeData.seats_count}
            onChange={handleChange}
            required
            min={1}
            className="input-style"
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={planeData.status}
            onChange={handleChange}
            required
            className="input-style"
          >
            <option value="">Select status</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={saving} className="submit-button">
          {saving ? "saving..." : "save changes"}
        </button>
      </form>
    </div>
  );
}
