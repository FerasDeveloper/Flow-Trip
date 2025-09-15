import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PackageDetails.css";
import Booking from "./Booking";
// <<<<<<< HEAD

import EditButton from "../Component/EditButton";
import DeleteButton from "../Component/DeleteButton";
import { colors } from "../Component/Color";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../Component/ConfirmDialog";
import RateOwnerCard from "../Component/RateOwnerCard";
// =======
// import { useNavigate } from "react-router-dom";
import {
  BASETOURISM,
  baseURL,
  DELETE_PACKAGE,
  EDIT_PACKADE,
  GET_PACKAGE,
  PAYBYPOINT,
  EMAIL,
  ROLE,
} from "../Api/Api";
import PackageDetailsLoader from "../Component/PackageDetailsLoader";
import Cookies from "js-cookie";


const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const[ownerId,setOwnerId]= useState(null);
  const fallbackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836";
  const navigate = useNavigate();

  const token = Cookies.get("token") || localStorage.getItem("token");
  const userRole = Cookies.get("role") || localStorage.getItem("role");
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`${baseURL}/${GET_PACKAGE}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data.data) {
          setPackageData(res.data.data);
          setEditDescription(res.data.data.discription || "");
          setEditPrice(res.data.data.total_price || "");
          setEditImagePreview(
            res.data.data.package_picture ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          );
        }
        setOwnerId(res.data.data.tourism_company.owner_id)
        console.log(res)
      } catch (err) {
        console.error("Error fetching package details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const formData = new FormData();
    formData.append("discription", editDescription);
    formData.append("total_price", editPrice);
    if (editImage) {
      formData.append("package_picture", editImage);
    }
    try {
      const response = await axios.post(
        `${baseURL}/${BASETOURISM}/${EDIT_PACKADE}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Package updated successfully!", { position: "top-right" });
      setShowEditModal(false);
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      toast.error("Failed to update package.", { position: "top-right" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePackage = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${baseURL}/${BASETOURISM}/${DELETE_PACKAGE}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Package deleted successfully", { position: "top-right" });
      setShowDeleteDialog(false);
      setTimeout(() => navigate("/TourismCompany/dashboard/packages"), 1200);
    } catch (err) {
      toast.error("Failed to delete the package", { position: "top-right" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePayByPoints = async () => {
    try {
      const response = await axios.get(`${baseURL}/${PAYBYPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPackageData((prevData) => ({
        ...prevData,
        payment_by_points: prevData.payment_by_points === 1 ? 0 : 1,
      }));

      const action =
        packageData.payment_by_points === 1 ? "removed" : "enabled";
      toast.success(`Payment by points ${action} successfully!`, {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to process payment by points.", {
        position: "top-right",
      });
    }
  };

  // const handleRatingChange = async (e) => {
  //   const selectedRating = e.target.value;
  //   setRating(selectedRating);

  //   const token = Cookies.get("token") || localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/not-registered");
  //     return;
  //   }

  //   try {
  //     await axios.post(
  //       "http://127.0.0.1:8000/api/rate-owner",
  //       {
  //         owner_id: packageData.tourism_company.owner_id,
  //         rating: selectedRating,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     toast.success("Thanks for rating!", { position: "top-right" });
  //   } catch (err) {
  //     console.error("Error submitting rating:", err);
  //     toast.error("Failed to submit rating.", { position: "top-right" });
  //   }
  // };

  const handleBookingNavigation = (paymentMethod) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      navigate("/not-registered");
      return;
    }

    // Show booking modal instead of navigation
    setSelectedPaymentMethod(paymentMethod);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedPaymentMethod(null);
  };

  const handlePaymentComplete = (paymentData) => {
    // Handle payment completion
    console.log("Payment completed:", paymentData);
    setShowBookingModal(false);
    setSelectedPaymentMethod(null);
    toast.success("Booking completed successfully!", { position: "top-right" });
  };

const handleTourismCompanyClick=()=>{
  if (userRole==="user") {
    navigate(`/owner_profile/${ownerId}`);
  }else if (userRole === "Tourism Company") {
    navigate(`/TourismCompany/dashboard/profile`);
  }
    
}

  if (loading) return <PackageDetailsLoader />;
  if (!packageData) return <p>Package not found</p>;

  const allPictures = packageData.package_element.flatMap((el) =>
    el.package_element_picture.length > 0
      ? el.package_element_picture.map((p) => p.picture_path)
      : [fallbackImage]
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  // const userType = localStorage.getItem("user_type");

  // Check if current user is the owner of this tourism company package
  const isPackageOwner = packageData &&
    packageData.tourism_company &&
    packageData.tourism_company.owner &&
    packageData.tourism_company.owner.user &&
    packageData.tourism_company.owner.user.email === EMAIL;

  // Check if user is tourism company from role
  const isTourismCompany = userRole === "Tourism Company" || userRole === "Tourism%20Company";

  // Debug logs
  console.log("Debug PackageDetails:");
  console.log("userRole:", userRole);
  console.log("EMAIL:", EMAIL);
  console.log("isTourismCompany:", isTourismCompany);
  console.log("isPackageOwner:", isPackageOwner);
  console.log("packageData.tourism_company?.owner?.user?.email:", packageData?.tourism_company?.owner?.user?.email);

  return (
    <div className="packageDetailsContainer">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Slider {...sliderSettings} className="packageSlider">
        {allPictures.map((pic, index) => (
          <div key={index}>
            <img src={pic} alt={`slide-${index}`} className="sliderImage" />
          </div>
        ))}
      </Slider>

      <div className="packageInfo">
        <h1 onClick={handleTourismCompanyClick} className="companyName">
          {packageData.tourism_company.company_name}
        </h1>
        <p className="description">{packageData.discription}</p>
        <p className="price">${packageData.total_price}</p>
        {packageData.payment_by_points === 1 && (
          <p className="price">Also available with points</p>
        )}

        {/* Rating Section
        {userType !== "tourism" && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <h3 style={{
              color: "#333",
              marginBottom: "10px",
              fontSize: "18px",
              fontWeight: "600"
            }}>
              Rate this Package
            </h3>
            <RateOwnerCard onChange={handleRatingChange} />
            {rating && (
              <p style={{
                marginTop: "10px",
                color: "#ff9e0b",
                fontWeight: "bold",
                fontSize: "14px"
              }}>
              </p>
            )}
          </div>
        )} */}
      </div>

      <div className="elementsSection">
        <h2 className="elementsTitle">What's Included</h2>
        <div className="elementsList">
          {packageData.package_element.map((el) => (
            <div
              key={el.id}
              className="elementCard"
              onClick={() =>
                navigate(`/element-details/${el.id}`, { state: { id: el.id } })
              }
            >
              <img
                src={
                  el.package_element_picture.length > 0
                    ? el.package_element_picture[0].picture_path
                    : fallbackImage
                }
                alt={el.name}
                className="elementImage"
              />
              <div className="elementContent">
                <h3>{el.name}</h3>
                <p className="elementType">{el.type}</p>
                <p>{el.discription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bookingFooter">
        {userRole === "admin" || userRole === "Admin" ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handlePayByPoints}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "1rem 2rem",
                border: "none",
                borderRadius: "50px",
                background:
                  packageData.payment_by_points === 1
                    ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow:
                  packageData.payment_by_points === 1
                    ? "0 8px 25px rgba(220, 53, 69, 0.3)"
                    : "0 8px 25px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                minWidth: "200px",
                justifyContent: "center",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  packageData.payment_by_points === 1
                    ? "0 12px 35px rgba(220, 53, 69, 0.4)"
                    : "0 12px 35px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  packageData.payment_by_points === 1
                    ? "0 8px 25px rgba(220, 53, 69, 0.3)"
                    : "0 8px 25px rgba(102, 126, 234, 0.3)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M12 6V18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 12H18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <span>
                {packageData.payment_by_points === 1
                  ? "Remove Payment by Points"
                  : "Enable Payment by Points"}
              </span>
            </button>
          </div>
        ) : isTourismCompany && isPackageOwner ? (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexDirection: "row-reverse",
            }}
          >
            <button
              className="customAddButton"
              onClick={() => navigate(`/add-package-element/${id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                border: "none",
                borderRadius: "30px",
                background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px 0 rgba(67,233,123,0.15)",
                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08) rotate(-2deg)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="11"
                    fill="rgba(255,255,255,0.15)"
                  />
                  <path
                    d="M11 6V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 11H16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span style={{ position: "relative", zIndex: 1 }}>Add</span>
            </button>
            <div
              onClick={() => setShowEditModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <EditButton />
            </div>
            <div
              onClick={() => setShowDeleteDialog(true)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <DeleteButton />
            </div>
          </div>
        ) : (!userRole || userRole === "user" || userRole === "User") ? (
          // <div
          //   data-tooltip={`Price: $${packageData.total_price}`}
          //   className="buttonpriceanimation"
          // >
          //   <div className="button-wrapperpriceanimation">
          //     <div className="textpriceanimation">Buy Now</div>
          //     <span className="iconpriceanimation">
          //       <svg
          //         viewBox="0 0 16 16"
          //         className="bi bi-cart2"
          //         fill="currentColor"
          //         height="16"
          //         width="16"
          //         xmlns="http://www.w3.org/2000/svg"
          //       >
          //         <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
          //       </svg>
          //     </span>
          //   </div>
          // </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {/* زر الدفع العادي */}
            <div
              data-tooltip={`Price: $${packageData.total_price}`}
              className="buttonpriceanimation"
              onClick={() => handleBookingNavigation('card')}
              style={{ cursor: 'pointer' }}
            >
              <div className="button-wrapperpriceanimation">
                <div className="textpriceanimation">Buy Now</div>
                <span className="iconpriceanimation">
                  <svg
                    viewBox="0 0 16 16"
                    className="bi bi-cart2"
                    fill="currentColor"
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* زر الدفع بالنقاط إذا كان مفعّل */}
            {packageData.payment_by_points === 1 && (
              <div
                data-tooltip={`Pay with points`}
                className="buttonpriceanimation"
                style={{ background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)", cursor: 'pointer' }}
                onClick={() => handleBookingNavigation('points')}
              >
                <div className="button-wrapperpriceanimation">
                  <div className="textpriceanimation">
                    {packageData.total_price * 50} Points
                  </div>
                  <span className="iconpriceanimation">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 
              9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
          </div>

        ) : null}
      </div>
      {/* Edit Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(41, 53, 65, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            style={{
              background: colors.color4,
              borderRadius: 18,
              padding: 32,
              minWidth: 340,
              maxWidth: 400,
              boxShadow: "0 0 24px 0 #29354133",
              color: colors.color1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                color: colors.color2,
                cursor: "pointer",
                zIndex: 2,
              }}
              title="Close"
            >
              ×
            </button>
            <h2
              style={{
                color: colors.color2,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Edit Package
            </h2>
            <label style={{ fontWeight: "bold", color: colors.color2 }}>
              Description:
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: `1px solid ${colors.color3}`,
                fontSize: 16,
                background: colors.color6,
                color: colors.color1,
              }}
              required
            />
            <label style={{ fontWeight: "bold", color: colors.color2 }}>
              Total Price:
            </label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: `1px solid ${colors.color3}`,
                fontSize: 16,
                background: colors.color6,
                color: colors.color1,
              }}
              required
            />
            <label style={{ fontWeight: "bold", color: colors.color2 }}>
              Package Image:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={editImagePreview}
                alt="package preview"
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: `1.5px solid ${colors.color3}`,
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ flex: 1 }}
              />
            </div>
            <button
              type="submit"
              disabled={editLoading}
              style={{
                background: colors.color2,
                color: "white",
                padding: "12px 0",
                border: "none",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 12,
                transition: "background 0.3s",
                width: "100%",
              }}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
      {/* Delete Confirm Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          message={
            deleteLoading
              ? "Deleting package..."
              : "Are you sure you want to delete this package?"
          }
          onCancel={() => !deleteLoading && setShowDeleteDialog(false)}
          onConfirm={!deleteLoading ? handleDeletePackage : undefined}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
          }}
          onClick={handleCloseBookingModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Booking
              type="package"
              accommodation={{
                ...packageData,
                hotel_name: packageData.tourism_company?.company_name,
                location: "Package Booking",
                price: packageData.total_price,
                paymentMethod: selectedPaymentMethod,
                package_id: id
              }}
              onClose={handleCloseBookingModal}
              onPayment={handlePaymentComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
