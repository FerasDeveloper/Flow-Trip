import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Packages.css";
import PackageCard from "../Component/PackageCard";

import { baseURL, GET_ALL_PACKAGE } from "../Api/Api";
import PackageCardSkeleton from "../Component/PackageCardSkeleton";

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

export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${baseURL}/${GET_ALL_PACKAGE}`, {
        });
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

  const handleCardClick = (id) => {
    navigate(`/package-details/${id}`);
  };

  return (
    <div className="RightPare">
      <h1 style={{ margin: "10px 0 0 30px" }}>Packages</h1>
      <div className="cards">
        {loading ?
          (
            Array.from({ length: 8 }).map((_, index) => (
              <PackageCardSkeleton key={index} />
            ))
          )
          : (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                image={pkg.package_picture ? `http://127.0.0.1:8000/storage/${pkg.package_picture}` : "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"}
                title={pkg.tourism_company?.company_name || "Unknown Company"}
                description={pkg.discription}
                price={pkg.total_price}
                isPointPayment={pkg.payment_by_points === 1}
                onClick={() => handleCardClick(pkg.id)}
              />
            ))
          )}
      </div>
    </div>
  );
}
