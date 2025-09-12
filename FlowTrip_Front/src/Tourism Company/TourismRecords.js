import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./TourismRecords.css";
import RecordPackageCard from "../Component/RecordPackageCard";
import Cookies from "js-cookie";
import {
  BASETOURISM,
  baseURL,
  GET_MOST_POPULAR_PACKAGES_FOR_COMPANY,
} from "../Api/Api";
import SkeletonRecordsCard from "../Component/SkeletonRecordsCard";

const TourismRecords = () => {
  const [packages, setPackages] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorDefault, setErrorDefault] = useState("");
  const [errorLatest, setErrorLatest] = useState("");
  const [mode, setMode] = useState("new"); // new | old | latest

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setErrorDefault("");
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await axios.get(
          "http://127.0.0.1:8000/api/tourism/getPackagesfortourism",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const statusFlag = res?.data?.status;
        const apiMessage = res?.data?.message;

        if (statusFlag && statusFlag !== "success") {
          setErrorDefault(
            apiMessage || "Unable to retrieve records. Try again later"
          );
          setPackages([]);
        } else {
          const data = res?.data?.data ?? [];
          setPackages(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        const apiMessage = e?.response?.data?.message;
        const statusCode = e?.response?.status;
        const statusText =
          e?.response?.data?.status || e?.response?.statusText;
        const finalMessage =
          apiMessage || e?.message || "Unable to retrieve records. Try again later..";

        setErrorDefault(finalMessage);
        console.error("Fetch packages failed", {
          statusCode,
          statusText,
          message: apiMessage || e?.message,
          data: e?.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const fetchPopularPackages = async () => {
    setLoading(true);
    setErrorLatest("");
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${baseURL}/${BASETOURISM}/${GET_MOST_POPULAR_PACKAGES_FOR_COMPANY}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const statusFlag = res?.data?.status;
      const apiMessage = res?.data?.message;

      if (statusFlag && statusFlag !== "success") {
        setErrorLatest(
          apiMessage || "Unable to fetch newer packages. Try again later"
        );
        setPopularPackages([]);
      } else {
        const data = res?.data?.data ?? [];
        setPopularPackages(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      const apiMessage = e?.response?.data?.message;
      const statusCode = e?.response?.status;
      const statusText =
        e?.response?.data?.status || e?.response?.statusText;
      const finalMessage =
        apiMessage || e?.message || "Unable to fetch newer packages. Try again later.";

      setErrorLatest(finalMessage);
      console.error("Fetch most popular packages failed", {
        statusCode,
        statusText,
        message: apiMessage || e?.message,
        data: e?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const sortedPackages = useMemo(() => {
    const cloned = [...packages];
    cloned.sort((a, b) => (mode === "new" ? b.id - a.id : a.id - b.id));
    return cloned;
  }, [packages, mode]);

  const handleSelect = async (nextMode) => {
    setMode(nextMode);
    if (nextMode === "latest" && popularPackages.length === 0) {
      await fetchPopularPackages();
    }
  };

  return (
    <div className="tourism-records-container">
      <div className="tourism-records-card">
        <h1 className="tourism-records-title">Tourism company records</h1>

        <div className="glass-radio-group-records">
          <input
            type="radio"
            name="records-plan"
            id="glass-records-new"
            checked={mode === "new"}
            onChange={() => handleSelect("new")}
          />
          <label htmlFor="glass-records-new">new</label>

          <input
            type="radio"
            name="records-plan"
            id="glass-records-old"
            checked={mode === "old"}
            onChange={() => handleSelect("old")}
          />
          <label htmlFor="glass-records-old">old</label>

          <input
            type="radio"
            name="records-plan"
            id="glass-records-latest"
            checked={mode === "latest"}
            onChange={() => handleSelect("latest")}
          />
          <label htmlFor="glass-records-latest">Trending</label>

          <div className="glass-glider-records"></div>
        </div>

        {loading ? (
          <div className="recordsGrid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRecordsCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {(mode !== "latest" ? errorDefault : errorLatest) && (
              <p style={{ marginTop: 24, color: "#b00020" }}>
                {mode !== "latest" ? errorDefault : errorLatest}
              </p>
            )}
            <div className="recordsGrid">
              {mode !== "latest"
                ? sortedPackages.map((pkg) => (
                    <RecordPackageCard
                      key={pkg.id}
                      id={pkg.id}
                      image={pkg.picture}
                      description={pkg.description}
                      totalPrice={pkg.total_price}
                      paymentByPoints={pkg.payment_by_points}
                    />
                  ))
                : popularPackages.map((pkg) => (
                    <RecordPackageCard
                      key={pkg.id}
                      id={pkg.id}
                      image={pkg.package_picture}
                      description={pkg.discription}
                      totalPrice={pkg.total_price}
                      paymentByPoints={pkg.payment_by_points}
                    />
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourismRecords;
