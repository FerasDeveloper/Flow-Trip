import React, { useEffect, useState } from "react";
import "./CarFilter.css";
import { FaWhatsapp } from "react-icons/fa";
import CarCardSkeleton from "../Component/CarCardSkeleton"; // ⬅️ استيراد السكيليتون
import { useNavigate } from "react-router-dom";

const API_SEARCH = "http://127.0.0.1:8000/api/searchVehicles";
const API_ALL = "http://127.0.0.1:8000/api/getAllVehicles";

export default function CarFilter() {
  const navigate=useNavigate();
  const [location, setLocation] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const extractCity = (loc) => {
    if (!loc) return null;
    const parts = String(loc).split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3) return parts[parts.length - 2];
    if (parts.length === 2) return parts[0];
    return parts[0] || null;
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(API_ALL);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status} – ${res.statusText}\n${txt.slice(0,200)}`);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setResults(list);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "Failed to load vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setErrorMsg("");

    const payload = {};
    if (location.trim()) payload.location = location.trim();
    if (vehicleName.trim()) payload.vehicle_name = vehicleName.trim();
    if (peopleCount) payload.people_count = Number(peopleCount);

    const isEmpty = Object.keys(payload).length === 0;

    try {
      if (isEmpty) {
        const res = await fetch(API_ALL);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status} – ${res.statusText}\n${txt.slice(0,200)}`);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setResults(list);
        return;
      }

      const res = await fetch(API_SEARCH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `HTTP ${res.status} – ${res.statusText}.\nResponse: ${text.slice(0, 200)}`
        );
      }

      const contentType = res.headers.get("Content-Type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = JSON.parse(text);
      }

      const list = Array.isArray(data) ? data : data?.data ?? [];
      setResults(list);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };
const handleVehicleClick =(owner_id)=>{
  navigate(`/owner_profile/${owner_id}`)
}
  const buildWhatsAppLink = (phone, title, loc) => {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return null;
    const msg = `Hello, I'm interested in renting "${title}"${loc ? ` in ${loc}` : ""}. Is it available?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  const SKELETON_COUNT = 8; // عدد السكيليتون أثناء التحميل

  return (
    <>
      {/* HERO + FORM */}
      <div className="cf-hero">
        <div className="cf-bg" />
        <div className="cf-inner">
          <div className="cf-heading">
            <h1>Find and book rental cars</h1>
            <h1>anywhere in the world</h1>
          </div>

          <form className="cf-form" onSubmit={onSubmit}>
            <div className="cf-field cf-grow">
              <label className="cf-label">Location</label>
              <input
                className="cf-input"
                type="text"
                placeholder="City or Airport"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="cf-field">
              <label className="cf-label">Vehicle Name</label>
              <input
                className="cf-input"
                type="text"
                placeholder=" BMW 2021"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
            </div>

            <div className="cf-field">
              <label className="cf-label">People Count</label>
              <input
                className="cf-input"
                type="number"
                min="1"
                placeholder="5"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
              />
            </div>

            <button type="submit" className="cf-submit" disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <section className="cf-results-wrap">
        <div className="cf-inner">
          <div className="cf-results">
            {errorMsg && (
              <div
                className="cf-empty"
                style={{ borderColor: "#e74c3c", color: "#e74c3c" }}
              >
                {errorMsg}
              </div>
            )}

            {/* شبكة النتائج: سكيليتون أثناء التحميل */}
            <div className="cf-grid">
              {loading
                ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                    <CarCardSkeleton key={`car-skel-${idx}`} />
                  ))
                : results.length === 0 && !errorMsg
                ? (
                  <div className="cf-empty" style={{ gridColumn: "1 / -1" }}>
                    No vehicles to show.
                  </div>
                )
                : results.map((item) => {
                    const title = item.name || item.vehicle_name || "Vehicle";
                    const ppl = item.people_count ?? item.capacity ?? "—";
                    const owner =
                      item.owner_name ||
                      item.vehicle_owner?.owner_name ||
                      "—";
                    const phone =
                      item.phone_number ||
                      item.vehicle_owner?.user?.phone_number ||
                      item.vehicle_owner?.phone_number ||
                      "—";
                    const loc =
                      item.location ||
                      item.vehicle_owner?.location ||
                      "—";
                    const city = extractCity(loc) || "—";
                    const type =
                      item.car_type ||
                      item.car_type_name ||
                      item.car_type?.name ||
                      item.type_name ||
                      "—";
                    const waLink =
                      phone && phone !== "—"
                        ? buildWhatsAppLink(phone, title, loc)
                        : null;

                    return (
                      <div onClick={()=>handleVehicleClick(item.owner_id)} key={item.id ?? `${title}-${owner}-${phone}`} className="cf-card no-img">
                        <div className="cf-card-body">
                          <div className="cf-card-head">
                            <h3 className="cf-card-title">{title}</h3>
                            {waLink ? (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cf-book-btn small"
                                aria-label="Book on WhatsApp"
                                title="Book on WhatsApp"
                              >
                                <FaWhatsapp className="cf-wa-ico" />
                                Book on WhatsApp
                              </a>
                            ) : (
                              <button className="cf-book-btn small disabled" disabled>
                                WhatsApp unavailable
                              </button>
                            )}
                          </div>

                          <div className="cf-tags">
                            <span className="cf-chip">👥 {ppl} people</span>
                          </div>

                          <div className="cf-list">
                            <p className="cf-meta">
                              <span className="cf-ico">🏷️</span>
                              <strong>Type:</strong>&nbsp;{type}
                            </p>

                            <p className="cf-meta">
                              <span className="cf-ico">🗺️</span>
                              <strong>City:</strong>&nbsp;{city}
                            </p>

                            <p className="cf-meta">
                              <span className="cf-ico">👤</span>
                              <strong>Owner:</strong>&nbsp;{owner}
                            </p>

                            <p className="cf-meta">
                              <span className="cf-ico">📞</span>
                              <strong>Phone:</strong>&nbsp;
                              {phone !== "—" ? <a href={`tel:${phone}`}>{phone}</a> : "—"}
                            </p>

                            <p className="cf-meta">
                              <span className="cf-ico">📍</span>
                              <strong>Location:</strong>&nbsp;{loc}
                            </p>
                          </div>

                          {item.description && (
                            <p className="cf-desc">{item.description}</p>
                          )}
                          {item.car_discription && !item.description && (
                            <p className="cf-desc">{item.car_discription}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
