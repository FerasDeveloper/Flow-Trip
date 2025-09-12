import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./PackageRecords.css";
import { BASETOURISM, baseURL, GET_RECORDS_FOR_PACKAGE } from "../Api/Api";
import PackageRecordsSkeleton from "../Component/PackageRecordsSkeleton.js";

export default function PackageRecordsTorismrecord() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("authToken") || localStorage.getItem("token");
        const res = await axios.get(
          `${baseURL}/${BASETOURISM}/${GET_RECORDS_FOR_PACKAGE}/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        const statusFlag = res?.data?.status;
        const apiMessage = res?.data?.message;
        if (statusFlag && statusFlag !== "success") {
          setError(apiMessage || "Unable to fetch logs for this package.");
          setRecords([]);
        } else {
          const data = res?.data?.data ?? [];
          setRecords(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        const apiMessage = e?.response?.data?.message;
        const finalMessage =
          apiMessage || e?.message || "Unable to fetch logs for this package.";
        setError(finalMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [id]);

  const hasData = useMemo(() => (records?.length ?? 0) > 0, [records]);

  return (
    <div className="package-records-page-torismrecord">
      <div className="package-records-header-torismrecord">
        <h2>Packaging records #{id}</h2>
      </div>

      {loading && <PackageRecordsSkeleton count={10} />}

      {!loading && error && (
        <p className="error-text-torismrecord">{error}</p>
      )}

      {!loading && !error && (
        <div className="recordsList-torismrecord">
          {!hasData && (
            <div className="empty-torismrecord">
              There are no records for this package..
            </div>
          )}
          {hasData &&
            records.map((rec, idx) => (
              <div key={idx} className="recordRowCard-torismrecord">
                <div className="avatarCircle-torismrecord" aria-hidden>
                  {(rec.traveler_name || "?").toString()[0]?.toUpperCase() ||
                    "?"}
                </div>
                <div className="recordInfo-torismrecord">
                  <div className="topLine-torismrecord">
                    <span className="primaryName-torismrecord">
                      {rec.user_name || "—"}
                    </span>
                  </div>
                  <div className="subLine-torismrecord">
                    {rec.national_number && (
                      <span className="pill-torismrecord pill-id-torismrecord">
                        national number: {rec.national_number}
                      </span>
                    )}
                    {rec.user_name && (
                      <span className="pill-torismrecord pill-username-torismrecord">
                        travel name: {rec.traveler_name}
                      </span>
                    )}
                    {rec.email && (
                      <span className="pill-torismrecord pill-email-torismrecord">
                        {rec.email}
                      </span>
                    )}
                    {rec.phone_number && (
                      <span className="pill-torismrecord pill-phone-torismrecord">
                        {rec.phone_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}