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
const [planeTypes, setPlaneTypes] = useState([]);
const [typesLoading, setTypesLoading] = useState(true);
const [typesError, setTypesError] = useState("");

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
    fetchPlaneTypes();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
    <div className="modiel-overlay">
      <div className="modiel-content" ref={modalRef}>
        <h2>Add a new plane</h2>

        <form onSubmit={handleSubmit} className="form-plane">
          <label>
   Aircraft type:
   <select
     name="plane_type_id"
     value={formData.plane_type_id}
     onChange={handleChange}
     required
    disabled={typesLoading || !!typesError}
   >
     <option value="" disabled>
      {typesLoading ? "Loading types..." : (typesError || "Select type")}
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

          <div className="modiel-buttons">
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
