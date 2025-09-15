import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryPopup.css";
import { toast } from "react-toastify";
import { baseURL, EDIT_REQUEST, GET_ALL_ACTIVITY, GET_ALL_OWNER_CATEGORIES, TOKEN } from "../Api/Api";

const token = TOKEN;

const CategoryPopup = ({ onClose, requestId, onSuccessUpdate }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/${GET_ALL_ACTIVITY}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setCategories(res.data.data || []);
      })
      .catch((err) => {
        toast.error(`Error:${err}`);
        toast.error("Failed to load category");
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleCategoryClick = async (name) => {
    try {
      await axios.post(
        `${baseURL}/${EDIT_REQUEST}/${requestId}`,
        { activity_name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccessUpdate(name); 
      onClose(); 
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error(`Error:${err}`);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Select a Category</h2>
        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category.id}
              className="popup-category-card category-card"
              onClick={() => handleCategoryClick(category.name)}
            >
              <p><strong>ID:</strong> {category.id}</p>
              <p><strong>Name:</strong> {category.name}</p>
            </div>
          ))}
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CategoryPopup;
