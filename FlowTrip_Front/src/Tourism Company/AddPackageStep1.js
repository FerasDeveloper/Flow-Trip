import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../Component/Color";
import "./AddPackageStep1.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASETOURISM, baseURL, CREATE_PACKAGE, TOKEN } from "../Api/Api";
// import { base } from "framer-motion/client";

const AddPackageStep1 = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [paymentByPoints, setPaymentByPoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  // const handleNext = async (e) => {
  //   e.preventDefault();
  //   if (!image) {
  //     toast.error("Please select a package image.");
  //     return;
  //   }
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append("discription", description);
  //   formData.append("total_price", price);
  //   formData.append("checked", 1);
  //   formData.append("package_picture", image);
  //   try {
  //     const res = await fetch(`${baseURL}/${BASETOURISM}/${CREATE_PACKAGE}`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${TOKEN}`
  //       },
  //       body: formData
  //     });

  //     if (res.ok) {
  //       toast.success("Package created successfully!");
  //       setTimeout(() => navigate("/TourismCompany/dashboard/packages"), 1200);
  //     } else {
  //       const data = await res.json().catch(() => ({}));
  //       toast.error(data.message || "Failed to create package.");
  //     }
  //   } catch (err) {
  //     toast.error("Failed to create package.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a package image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("discription", description);
    formData.append("total_price", price);
    formData.append("checked", 1);
    formData.append("package_picture", image);

    // طباعة البيانات قبل الإرسال
    console.log("📌 Final URL:", `${baseURL}/${BASETOURISM}/${CREATE_PACKAGE}`);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await fetch(`${baseURL}/${BASETOURISM}/${CREATE_PACKAGE}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`
          // ملاحظة: لا تضيف Content-Type مع FormData، المتصفح بيحطها تلقائياً
        },
        body: formData
      });

      if (res.ok) {
        toast.success("Package created successfully!");
        setTimeout(() => navigate("/TourismCompany/dashboard/packages"), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Failed to create package.");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to create package.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="add-package-container">
      <div className="add-package-step1-container">
        <h2 className="add-package-step1-title">Add New Package</h2>
        <form className="add-package-step1-form" onSubmit={handleNext}>
          <label>Package Image:</label>
          <div
            className={`add-package-step1-dropzone${dragActive ? " drag-active" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="add-package-step1-image-preview" />
            ) : (
              <span style={{ color: colors.color3 }}>Drag & drop an image here, or click to select</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="add-package-step1-textarea"
            required
          />
          <label>Total Price:</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="add-package-step1-input"
            required
          />
          <div className="add-package-step1-checkbox-row">
            <input
              type="checkbox"
              id="paymentByPoints"
              checked={paymentByPoints}
              onChange={e => setPaymentByPoints(e.target.checked)}
              className="add-package-step1-checkbox"
            />
            <label htmlFor="paymentByPoints" style={{ color: colors.color2, cursor: 'pointer' }}>I pledge that I have obtained the approval of all participating parties.</label>
          </div>
          <button
            type="submit"
            className="add-package-step1-button"
            disabled={!paymentByPoints || loading}
          >
            {loading ? "Submitting..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackageStep1;
