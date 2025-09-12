import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OwnerDetailsComponent.css";
import ToggleButton from "./ToggleButton";
import Loader from "../Component/Loader";
import Button from "./AddButton";
import ConfirmDialog from "./ConfirmDialog";
import CloseButton from "../Component/CloseButton";
import EditButton from "./EditButton";
import {
  baseURL,
  SHOW_PROFILE,
  SHOW_OWNER,
  BLOCK_OWNER,
  TOKEN,
} from "../Api/Api";
import { style } from "framer-motion/client";

export default function OwnerDetailsComponent({ id, token, isAdmin }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceToDelete2, setServiceToDelete2] = useState(null);
  const [newService, setNewService] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [currentPictures, setCurrentPictures] = useState([]);
  const [deletedPictures, setDeletedPictures] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const authToken = TOKEN;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (id) {
        url = `http://127.0.0.1:8000/api/ShowOwner/${id}`;
      } else {
        url = `http://127.0.0.1:8000/api/ShowProfile`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setData(res.data);
      setSelectedCountry(res.data.owner.country);
      setSelectedCountryId(res.data.owner.countryId);

      // تهيئة نموذج التحرير للعرض
      const user = res.data.owner.user;
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        description: res.data.owner.description || "",
        location: res.data.owner.location || "",
        country_id: res.data.owner.country || "",
      });

      // صور المالك
      setCurrentPictures(
        (res.data.pictures || []).map((pic) => ({
          id: pic.id,
          reference: pic.reference,
          isNew: false,
        }))
      );

      if (isAdmin && res.data?.owner?.user?.status === 2) {
        setIsBlocked(true);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/GetAllCountries");
      setCountries(res.data.countries || []);
    } catch {
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCountries();
  }, [id, authToken, isAdmin]);

  const handleToggleBlock = async (checked) => {
    if (!isAdmin) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/BlockOwner/${data.owner.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setIsBlocked(checked);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone_number: "",
    description: "",
    location: "",
    country_id: "",
  });

  const handleOpenServicesModal = async () => {
    setShowServicesModal(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/GetAllServices");
      const data = await response.json();
      setAllServices(data.services || []);
    } catch (error) {
      setAllServices([]);
    }
  };
  const handleCloseServicesModal = () => {
    setSelectedServices([]);
    setNewService("");
    setServiceToDelete(null);
    setServiceToDelete2(null);
    setShowServicesModal(false);
  };

  const toggleService = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleDoneAddServices = async () => {
    // 1. جهّز مصفوفة الخدمات لإرسالها
    const servicesToSend = [...selectedServices];
    const trimmedNew = newService.trim();
    if (trimmedNew) {
      servicesToSend.push(trimmedNew);
    }

    if (servicesToSend.length === 0) {
      setShowServicesModal(false);
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/api/AddService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ services: servicesToSend }),
      });

      setShowServicesModal(false);
      setSelectedServices([]);
      setNewService("");
      fetchData();
    } catch (error) {
      alert("Failed to add services");
      console.log(error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      serviceId = serviceToDelete2;
      await fetch(`http://127.0.0.1:8000/api/DeleteService/${serviceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (error) {
      alert("Failed to delete service");
      console.log(error);
    }
  };

  // تحديث الحقول في نموذج التحرير
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // حذف صورة من المعرض
  const handlePictureDelete = (picId) => {
    const pic = currentPictures.find((p) => p.id === picId);
    if (!pic) return;

    // لو صورة جديدة فقط نتخلص من الـ URL المؤقت
    if (pic.isNew) URL.revokeObjectURL(pic.reference);
    else setDeletedPictures((prev) => [...prev, picId]);

    setCurrentPictures((prev) => prev.filter((p) => p.id !== picId));
  };

  // رفع صور جديدة
  const handlePictureUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPics = files.map((file, idx) => ({
      id: `temp-${Date.now()}-${idx}`,
      reference: URL.createObjectURL(file),
      file,
      isNew: true,
    }));
    setCurrentPictures((prev) => [...prev, ...newPics]);
    e.target.value = "";
  };

  // حفظ التعديلات
  const handleSaveProfile = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("phone_number", editData.phone_number);
      formData.append("description", editData.description);
      formData.append("location", editData.location);
      formData.append("country_id", selectedCountryId);

      // صور جديدة
      currentPictures
        .filter((p) => p.isNew)
        .forEach((p) => formData.append("images[]", p.file));

      // صور قديمة باقية
      const oldIds = currentPictures.filter((p) => !p.isNew).map((p) => p.id);
      if (oldIds.length > 0) {
        oldIds.forEach((id) => {
          formData.append("remaining_picture_ids[]", id);
        });
      }

      // صور محذوفة
      if (deletedPictures.length > 0) {
        deletedPictures.forEach((pic) => {
          formData.append("deleted_picture_ids[]", pic.id);
        });
      }

      const res = await axios.post(
        "http://127.0.0.1:8000/api/EditProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      // تحرير الـ URLs المؤقتة
      currentPictures.forEach((p) => {
        if (p.isNew) URL.revokeObjectURL(p.reference);
      });

      setIsEditing(false);
      fetchData();
      setDeletedPictures([]);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // إلغاء التحرير
  const handleCancelEditProfile = () => {
    // تحرير الـ URLs للصور المرفوعة مؤقتاً
    currentPictures.forEach((p) => {
      if (p.isNew) URL.revokeObjectURL(p.reference);
    });

    // إعادة تهيئة الصور والحالة
    setDeletedPictures([]);
    fetchData();
    setIsEditing(false);
  };

  if (loading) return <Loader />;
  if (error) return <div className="owner-details-error">{error}</div>;
  if (!data) return null;

  const { owner, details, vehicles, services, pictures, packages } = data;
  const user = owner.user;
  const country = owner.country;

  function renderCategoryDetails($id) {
    switch (owner.owner_category_id) {
      case 1:
        return (
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">🏨</span> */}
              Accommodation Type:
            </span>
            <span className="owner-details-value">
              {details.accommodation_type || "-"}
            </span>
          </div>
        );
      case 2:
        return (
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">✈️</span> */}
              Air Line Name:
            </span>
            <span className="owner-details-value">
              {details.air_line_name || "-"}
            </span>
          </div>
        );
      case 3:
        return (
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">🏢</span> */}
              Company Name:
            </span>
            <span className="owner-details-value">
              {details.company_name || "-"}
            </span>
          </div>
        );
      case 4:
        return (
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">🧑‍💼</span> */}
              Owner Name:
            </span>
            <span className="owner-details-value">
              {details.owner_name || "-"}
            </span>
          </div>
        );
      case 5:
        return (
          <>
            <div className="owner-details-section">
              <span className="owner-details-label">
                {/* <span className="owner-details-icon">🧑‍💼</span> */}
                Owner Name:
              </span>
              <span className="owner-details-value">
                {details.activity_owner.owner_name || "-"}
              </span>
            </div>
            <div className="owner-details-section">
              <span className="owner-details-label">
                {/* <span className="owner-details-icon">🎯</span> */}
                Activity:
              </span>
              <span className="owner-details-value">
                {details.activity || "-"}
              </span>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  if (isEditing) {
    return (
      <div className="owner-edit-container">
        <div className="owner-edit-header">
          <h2>Profile Editing</h2>
          <div className="edit-actions">
            <button
              className="owner-edit-btn cancel"
              onClick={handleCancelEditProfile}
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              className="owner-edit-btn save"
              onClick={handleSaveProfile}
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Done"}
            </button>
          </div>
        </div>
        <div className="owner-edit-content">
          <div className="edit-form-section">
            <h3>User Information</h3>
            <div className="owner-inputbox">
              <input
                type="text"
                required
                value={editData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <span>Name</span>
              <i></i>
            </div>
            <div className="owner-inputbox">
              <input
                type="email"
                required
                value={editData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <span>Email</span>
              <i></i>
            </div>
            <div className="owner-inputbox">
              <input
                type="tel"
                required
                value={editData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
              />
              <span>Phone Number</span>
              <i></i>
            </div>
            <div className="owner-inputbox">
              <input
                type="text"
                required
                value={editData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <span>Location</span>
              <i></i>
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                rows="3"
                className="description"
                value={editData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-pictures-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
                paddingBottom: "25px",
              }}
            >
              <span className="CountryWord">Country</span>
              <div className="owner-menu country-menu">
                <div className="owner-item">
                  <a
                    href="#"
                    className="link"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <span>{selectedCountry || ""}</span>
                    <svg
                      viewBox="0 0 360 360"
                      xml="space"
                      className="dropdown-arrow"
                    >
                      <g id="SVGRepo_iconCarrier">
                        <path
                          id="XMLID_225_"
                          d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                        />
                      </g>
                    </svg>
                  </a>
                  <div className="owner-submenu">
                    <div className="owner-submenu-item">
                      <a
                        href="#"
                        className="owner-submenu-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCountry("");
                          setSelectedCountryId("");
                        }}
                      ></a>
                    </div>
                    {countries.map((country) => (
                      <div className="owner-submenu-item" key={country.id}>
                        <a
                          href="#"
                          className="owner-submenu-link"
                          onClick={async (e) => {
                            e.preventDefault();
                            setSelectedCountry(country.name);
                            setSelectedCountryId(country.id);
                          }}
                        >
                          {country.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <h3>Pictures</h3>
            <div className="pictures-grid">
              {currentPictures.map((pic) => (
                <div key={pic.id} className="picture-item">
                  <img
                    src={
                      pic.isNew
                        ? pic.reference
                        : pic.reference.startsWith("http")
                        ? pic.reference
                        : `http://127.0.0.1:8000/${pic.reference}`
                    }
                    alt={`Owner picture ${pic.id}`}
                  />
                  <button
                    className="owner-delete-picture-btn"
                    onClick={() => handlePictureDelete(pic.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="add-picture-section">
              <input
                type="file"
                multiple
                accept="image/*"
                id="profile-upload"
                onChange={handlePictureUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-upload" className="add-picture-btn">
                Add Picture
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`owner-details-container ps-3 pe-3 ${
        isAdmin ? "fullWidth" : ""
      }`}
      style={{ position: "relative" }}
    >
      {!isAdmin && (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            position: "fixed",
            top: "4rem",
            right: "1.5rem",
            zIndex: "100",
          }}
        >
          <EditButton />
        </div>
      )}

      <div className="owner-details-top">
        <div className="owner-details-card">
          <h2 className="owner-details-title">Business Information</h2>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">🏷️</span> */}
              Category:
            </span>
            <span className="owner-details-value">{owner.category || "-"}</span>
          </div>
          {renderCategoryDetails(owner.owner_category_id)}{" "}
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">📍</span> */}
              Location:
            </span>
            <span className="owner-details-value">{owner.location || "-"}</span>
          </div>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">📅</span> */}
              Creation date:
            </span>
            <span className="owner-details-value">
              {owner.created_at?.slice(0, 10) || "-"}
            </span>
          </div>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">📝</span> */}
              Description:
            </span>
            <span className="owner-details-value">
              {owner.description || "-"}
            </span>
          </div>
        </div>

        <div className="owner-details-card">
          <h2 className="owner-details-title">User Information</h2>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">👤</span> */}
              User Name:
            </span>
            <span className="owner-details-value">{user.name || "-"}</span>
          </div>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">✉️</span> */}
              Email:
            </span>
            <span className="owner-details-value">{user.email || "-"}</span>
          </div>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">📞</span> */}
              Phone Number:
            </span>
            <span className="owner-details-value">
              {user.phone_number || "-"}
            </span>
          </div>
          <div className="owner-details-section">
            <span className="owner-details-label">
              {/* <span className="owner-details-icon">🌍</span> */}
              Country:
            </span>
            <span className="owner-details-value">{country || "-"}</span>
          </div>
        </div>
      </div>

      <div className="more-info-section">
        <div
          className="owner-services-section"
          style={{ position: "relative" }}
        >
          {!isAdmin && (
            <Button
              text="Add Service"
              style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
              onClick={handleOpenServicesModal}
            />
          )}
          <h2 className="owner-services-title">Services</h2>
          <div className="owner-services-list">
            {services && services.length > 0 ? (
              services.map((svc) => (
                <div
                  key={svc.id}
                  className="owner-service-card"
                  style={{ position: "relative" }}
                  onMouseEnter={() => setServiceToDelete(svc.id)}
                  onMouseLeave={() => setServiceToDelete(null)}
                >
                  {/* <span className="owner-service-icon">🛎️</span> */}
                  <span className="owner-service-name">{svc.name}</span>
                  {!isAdmin && serviceToDelete === svc.id && (
                    <button
                      className="delete-service-btn"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setServiceToDelete(svc.id);
                        setServiceToDelete2(svc.id);
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        border: "none",
                      }}
                    >
                      <i
                        className="fa-solid fa-trash"
                        style={{ color: "var(--color2)" }}
                      />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="owner-service-empty">No services available</div>
            )}
          </div>

          {/* Add / Remove Services Modal */}
          {showServicesModal && (
            <div className="service-modal-overlay">
              <div className="service-modal-content">
                <div
                  onClick={handleCloseServicesModal}
                  style={{ float: "left" }}
                >
                  <CloseButton />
                </div>
                <h3 style={{ textAlign: "end" }}>All Services</h3>
                <div className="services-grid">
                  {allServices.length > 0 ? (
                    allServices.map((svc) => (
                      <div
                        key={svc.id}
                        className={`service-card${
                          selectedServices.includes(svc.name) ? " selected" : ""
                        }`}
                        onClick={() => toggleService(svc.name)}
                      >
                        <span className="service-icon">🛎️</span>
                        <span className="service-name">{svc.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-services">No service available</div>
                  )}
                </div>
                <div className="service-input">
                  <input
                    type="text"
                    className="new-service-input"
                    placeholder="New Service"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                  />
                </div>
                <button className="done-btn" onClick={handleDoneAddServices}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Service Confirmation */}
        {showDeleteDialog && (
          <ConfirmDialog
            message="Are you sure you want to delete this service?"
            onConfirm={async () => {
              await handleDeleteService(serviceToDelete);
              setShowDeleteDialog(false);
              setServiceToDelete(null);
            }}
            onCancel={() => {
              setShowDeleteDialog(false);
              setServiceToDelete(null);
            }}
          />
        )}

        {/* Owner Pictures Slider (display only) */}
        <div
          className={`owner-details-pictures-section ${
            !pictures || pictures.length === 0
              ? "owner-details-no-pictures"
              : ""
          }`}
        >
          <h2 className="owner-details-pictures-title">Pictures</h2>
          <div
            className={`owner-details-css-slider-container ${
              pictures && pictures.length <= 3
                ? "owner-details-no-animation"
                : ""
            } ${
              !pictures || pictures.length === 0
                ? "owner-details-empty-container"
                : ""
            }`}
          >
            <div className="owner-details-css-slider-track">
              {pictures && pictures.length > 0 ? (
                <>
                  {pictures.map((pic, idx) => (
                    <div
                      className="owner-details-css-slide"
                      key={`original-${idx}`}
                    >
                      <img
                        src={
                          pic.reference.startsWith("http")
                            ? pic.reference
                            : `http://127.0.0.1:8000/${pic.reference}`
                        }
                        alt={`Owner pic ${idx + 1}`}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/180x120?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                  {/* Duplicate images for seamless loop - only if more than 3 images */}
                  {pictures.length > 3 &&
                    pictures.map((pic, idx) => (
                      <div
                        className="owner-details-css-slide"
                        key={`duplicate-${idx}`}
                      >
                        <img
                          src={
                            pic.reference.startsWith("http")
                              ? pic.reference
                              : `http://127.0.0.1:8000/${pic.reference}`
                          }
                          alt={`Owner pic ${idx + 1}`}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/180x120?text=No+Image";
                          }}
                        />
                      </div>
                    ))}
                </>
              ) : (
                <div className="owner-details-no-images">
                  <span>No Images Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Packages (for category_id === 3) */}
        {owner.owner_category_id === 3 && packages.length > 0 && (
          <div className="owner-services-section">
            <h2 className="owner-services-title">Packages</h2>
            <div className="owner-services-list">
              {packages.map((pkg) => (
                <div className="owner-service-card" key={pkg.id}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* <span className="owner-service-icon">🧳</span> */}
                      <span style={{ color: "var(--color1)" }}>
                        <b>Price:</b>{" "}
                        <span
                          style={{ color: "var(--color2)", fontWeight: "bold" }}
                        >
                          {pkg.total_price}$
                        </span>
                      </span>
                    </div>
                    <span style={{ color: "var(--color1)" }}>
                      <b>Payment:</b>{" "}
                      <span
                        style={{ color: "var(--color2)", fontWeight: "bold" }}
                      >
                        {pkg.payment_by_points === 1 ? "By Points" : "By Money"}
                      </span>
                    </span>
                    <span style={{ color: "var(--color1)" }}>
                      <b>Description:</b>{" "}
                      <span
                        style={{ color: "var(--color2)", fontWeight: "600" }}
                      >
                        {pkg.discription && pkg.discription.length > 30
                          ? pkg.discription.slice(0, 30) + "..."
                          : pkg.discription}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicles (for category_id === 4) */}
        {owner.owner_category_id === 4 && vehicles.length > 0 && (
          <div className="owner-services-section">
            <h2 className="owner-services-title">Vehicles</h2>
            <div className="owner-services-list">
              {vehicles.map((v) => (
                <div className="owner-service-card" key={v.id}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* <span className="owner-service-icon">🚙</span> */}
                      <span style={{ color: "var(--color1)" }}>
                        <b>Type:</b>{" "}
                        <span
                          style={{ color: "var(--color2)", fontWeight: "bold" }}
                        >
                          {v.car_type}
                        </span>
                      </span>
                    </div>
                    <span style={{ color: "var(--color1)" }}>
                      <b>Description:</b>{" "}
                      <span
                        style={{ color: "var(--color2)", fontWeight: "w600" }}
                      >
                        {v.car_discription && v.car_discription.length > 38
                          ? v.car_discription.slice(0, 38) + "..."
                          : v.car_discription}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hotel Rooms (for category_id === 1 and Hotel) */}
        {owner.owner_category_id === 1 &&
          details.accommodation_type === "Hotel" &&
          Array.isArray(data.rooms) &&
          data.rooms.length > 0 && (
            <div className="hotel-rooms-section">
              <h2 className="hotel-rooms-title">Rooms</h2>
              <div className="hotel-rooms-list">
                {data.rooms.map((room) => (
                  <div
                    className="hotel-room-card"
                    key={room.id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/room-details/${room.id}`, {
                        state: {
                          ...(isAdmin && { isAdmin: true }),
                        },
                      })
                    }
                    title="Show room details"
                  >
                    <div className="hotel-room-info">
                      <div>
                        <b>Price:</b>{" "}
                        {room.offer_price ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "#b23c3c",
                                marginRight: 8,
                              }}
                            >
                              {room.price}$
                            </span>
                            <span
                              style={{ color: "#2e7d32", fontWeight: "bold" }}
                            >
                              {room.offer_price}$
                            </span>
                          </>
                        ) : (
                          <span
                            style={{ color: "#2e7d32", fontWeight: "bold" }}
                          >
                            {room.price}$
                          </span>
                        )}
                      </div>
                      <div>
                        <b>Area:</b> {room.area} m²
                      </div>
                      <div>
                        <b>People Count:</b> {room.people_count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            top: "calc(1rem + 1vw)",
            right: "calc(1rem + 1vw)",
          }}
        >
          <ToggleButton
            checked={isBlocked}
            onChange={(e) => handleToggleBlock(e.target.checked)}
            width={90}
            height={35}
            toggleWidth={37}
            toggleHeight={23}
          />
        </div>
      )}
    </div>
  );
}
