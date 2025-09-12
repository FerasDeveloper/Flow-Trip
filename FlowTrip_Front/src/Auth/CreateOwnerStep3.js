import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateOwnerStep3.css";
import {
  baseURL,
  CREATEOWNER,
  GET_ALL_ACCOMMODATION_TYPES,
  GET_ALL_ACTIVITY,
} from "../Api/Api";

const CreateOwnerStep3 = () => {
  const location = useLocation();
  const { categoryId, countryId } = location.state || {};

  const ACCOMMODATION_CATEGORY_ID = 1;
  const ACTIVITY_OWNER_CATEGORY_ID = 5;

  const [formData, setFormData] = useState({
    location: "",
    description: "",
    accommodation_type: "",
    activity_name: "",
    business_name: "",
  });

  const [accommodationTypes, setAccommodationTypes] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [categoryType, setCategoryType] = useState("");
  const [showCustomActivityField, setShowCustomActivityField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if required data is available
    if (!categoryId || !countryId) {
      toast.error("Missing required data. Please go back and try again.");
      return;
    }

    if (categoryId === ACCOMMODATION_CATEGORY_ID) {
      setCategoryType("accommodation");
      axios
        .get(`${baseURL}/${GET_ALL_ACCOMMODATION_TYPES}`)
        .then((res) => {
          setAccommodationTypes(res.data.accommodation_types || []);
        })
        .catch((err) => {
          console.error("Error fetching accommodation types:", err);
          toast.error("Failed to load accommodation types");
        });
    } else if (categoryId === ACTIVITY_OWNER_CATEGORY_ID) {
      setCategoryType("activity");
      axios
        .get(`${baseURL}/${GET_ALL_ACTIVITY}`)
        .then((res) => {
          setActivityList(res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching activities:", err);
          toast.error("Failed to load activities");
        });
    } else {
      setCategoryType("other");
    }
  }, [categoryId, countryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "activity_name") {
      setShowCustomActivityField(value === "other");
      if (value !== "other") {
        setFormData((prev) => ({ ...prev, activity_name: value }));
      } else {
        setFormData((prev) => ({ ...prev, activity_name: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomActivityChange = (e) => {
    setFormData((prev) => ({ ...prev, activity_name: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.business_name ||
      !formData.location ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate category-specific fields
    if (categoryType === "accommodation" && !formData.accommodation_type) {
      toast.error("Please select an accommodation type");
      return;
    }

    if (categoryType === "activity" && !formData.activity_name) {
      toast.error("Please select or enter an activity name");
      return;
    }

    setIsLoading(true);

    try {
      // Get user email from localStorage
      // const userEmail = localStorage.getItem("email");
      const emailFromLocal = localStorage.getItem("email");

      const emailFromCookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("email="))
        ?.split("=")[1];

      const userEmail = emailFromLocal || emailFromCookie;
      if (!userEmail) {
        toast.error("User email not found. Please login again.");
        return;
      }

      // Prepare submission data
      const submission = {
        owner_category_id: categoryId,
        country_id: countryId,
        location: formData.location,
        description: formData.description,
        business_name: formData.business_name,
      };

      // Add category-specific fields
      if (categoryType === "accommodation") {
        submission.accommodation_type = formData.accommodation_type;
      }

      if (categoryType === "activity") {
        submission.activity_name = formData.activity_name;
      }

      console.log(
        "Sending owner creation request to:",
        `${baseURL}/${CREATEOWNER}/${userEmail}`
      );
      console.log("Submitted Data:", submission);

      const response = await axios.post(
        `${baseURL}/${CREATEOWNER}/${userEmail}`,
        submission
      );

      console.log("Owner creation response:", response.data);

      if (
        response.data.success ||
        response.data.message ===
        "your request has been sent to the technical team.. pleas wait until the request processed."
      ) {
        toast.success(
          "your request has been sent to the technical team.. pleas wait until the request processed."
        );
      } else {
        toast.error(response.data.message || "Failed to create owner profile");
      }
    } catch (error) {
      console.error("Owner creation error:", error);

      if (error.response) {
        // Server error
        const errorMessage =
          error.response.data.message || "Failed to create owner profile";
        toast.error(errorMessage);
      } else if (error.request) {
        // Connection error
        toast.error(
          "Cannot connect to server. Please check your internet connection"
        );
      } else {
        // Other error
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="owner-form-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2 className="form-title">Create New Owner</h2>
      <form className="owner-form" onSubmit={handleSubmit}>
        <input
          name="business_name"
          placeholder="Business Name"
          value={formData.business_name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          disabled={isLoading}
        />

        {(categoryType === "accommodation" || categoryType === "activity") && (
          <>
            {categoryType === "accommodation" && (
              <select
                name="accommodation_type"
                value={formData.accommodation_type}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select Accommodation Type</option>
                {accommodationTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            )}

            {categoryType === "activity" && (
              <>
                <select
                  name="activity_name"
                  onChange={handleChange}
                  value={
                    showCustomActivityField ? "other" : formData.activity_name
                  }
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Activity</option>
                  {activityList.map((activity) => (
                    <option key={activity.id} value={activity.name}>
                      {activity.name}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>

                {showCustomActivityField && (
                  <input
                    name="activity_name"
                    placeholder="Enter Custom Activity"
                    value={formData.activity_name}
                    onChange={handleCustomActivityChange}
                    required
                    className="other-input"
                    disabled={isLoading}
                  />
                )}
              </>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Creating..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default CreateOwnerStep3;
