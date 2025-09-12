import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OwnerCategoryList.css";
import { useNavigate } from "react-router-dom";
import OwnerCatigoryCard from "../Component/OwnerCatigoryCard";
import { baseURL, GET_ALL_OWNER_CATEGORIES } from "../Api/Api";

const OwnerCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseURL}/${GET_ALL_OWNER_CATEGORIES}`)
      .then((res) => {
        if (Array.isArray(res.data.owners_categories)) {
          setCategories(res.data.owners_categories);
        } else {
          setCategories([]);
          console.warn("Unexpected data format from API");
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase())
  );

const handleClick = (category) => {
  navigate("/create-owner/step-2", {
    state: { categoryId: category.id },
  });
};


  return (
    <div className="owner-category-wrapper-search">
      <form className="form-search">
        <label htmlFor="input-search">Search</label>
        <input
          required
          pattern=".*\S.*"
          type="search"
          className="input-search"
          id="input-search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="caret-search"></span>
      </form>

      <div className="category-grid-search">
        {filteredCategories.map((cat) => (
          <OwnerCatigoryCard
          className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            key={cat.id}
            name={cat.name}
            onClick={() => handleClick(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default OwnerCategoryList;
