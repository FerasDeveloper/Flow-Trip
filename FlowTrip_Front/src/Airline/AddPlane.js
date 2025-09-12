import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AddPlane.css"
import { baseURL,ADD_PLANE, TOKEN } from "../Api/Api";

export default function AddPlane({ onClose }) {
  const [formData, setFormData] = useState({
    plane_type_id: "",
    seats_count: "",
    status: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      if (onClose) onClose();
      setError("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("الرجاء اختيار صورة للطائرة");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = TOKEN;

      const data = new FormData();
      data.append("plane_type_id", formData.plane_type_id);
      data.append("seats_count", formData.seats_count);
      data.append("status", formData.status);
      data.append("plane_shape_diagram", image);
      

      const res = await axios.post(`${baseURL}/${ADD_PLANE}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.message === "new plane added successfully") {
        if (onClose) onClose();
      } else {
        setError("فشل إضافة الطائرة");
      }
    } catch (err) {
      if (err.response) {
        setError("خطأ من السيرفر: " + JSON.stringify(err.response.data));
      } else {
        setError("خطأ في الإرسال: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Add a new plane</h2>

        <form onSubmit={handleSubmit} className="form">
          <label>
          Aircraft type:
                      <input
              type="text"
              name="plane_type_id"
              value={formData.plane_type_id}
              onChange={handleChange}
              required
            />
          </label>

          <label>
          Number of seats:
            <input
              type="text"
              name="seats_count"
              value={formData.seats_count}
              onChange={handleChange}
              required
            />
          </label>

          <label>
          status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
            <option value="" disabled style={{ color: "#ccc" }}>
    Select status
  </option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </label>

          <label>
          Airplane image:
                      <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="modal-buttons">
          <button
  type="submit"
  className="animated-btn"
  disabled={loading}
>
  {loading ? "Sending..." : "Add the plane"}
</button>

<button
  type="button"
  className="animated-btn cancel"
  onClick={() => {
    if (onClose) onClose();
  }}
>
  cancel
</button>

          </div>
        </form>
      </div>
    </div>
  );
}
