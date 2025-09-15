import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Packages.css";
import Button from "../Component/AddButton";
import PackageCard from "../Component/PackageCard";
import PackageCardSkeleton from "../Component/PackageCardSkeleton";
import { useNavigate } from "react-router-dom";
import { BASETOURISM, baseURL, GET_PACKAGES_FOR_TOURISM, TOKEN } from "../Api/Api";

const PackagesTourism = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
    const fetchPackages = async () => {
      try {
        console.log(`${baseURL}/${BASETOURISM}/${GET_PACKAGES_FOR_TOURISM}`,);
        const res = await axios.get(
          `${baseURL}/${BASETOURISM}/${GET_PACKAGES_FOR_TOURISM}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.data) {
          setPackages(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleAddClick = () => {
    navigate("/add-package/step1");
  };

  // localStorage.setItem("user_type", "tourism");

  return (
    <div className="packagesPageContainer">
      <div className="packagesHeader">
        <h1>Available Packages</h1>
        <Button text="Add Package" onClick={handleAddClick} />
      </div>

      <div className="packagesGrid">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
            <PackageCardSkeleton key={index} />
          ))
          : packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              image={
                pkg.picture ||
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              }
              title={`Package #${pkg.id}`}
              description={pkg.description}
              price={pkg.total_price}
              isPointPayment={pkg.payment_by_points === 1}
            />
          ))}
      </div>
    </div>
  );
};

export default PackagesTourism;
