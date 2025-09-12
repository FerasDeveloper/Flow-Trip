import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ActivityCardSkeleton from "../Component/ActivityCardSkeleton";

import "./HomePage.css";
import "./AllActivity.css";

const API_LIST = "http://127.0.0.1:8000/api/getActivity";
const API_FILTER = "http://127.0.0.1:8000/api/filterActivities";

export default function AllAcyivit() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [activityName, setActivityName] = useState("");
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const getImageUrl = (picture) => {
    if (!picture)
      return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
    if (picture.includes("storage\\")) {
      const fileName = picture.split("\\").pop();
      return `http://127.0.0.1:8000/storage/images/${fileName}`;
    }
    if (picture.includes("storage/")) {
      const fileName = picture.split("/").pop();
      return `http://127.0.0.1:8000/storage/images/${fileName}`;
    }
    return picture;
  };

  const applyClientFilter = (arr) => {
    const an = activityName.trim().toLowerCase();
    const pl = place.trim().toLowerCase();
    const cn = country.trim().toLowerCase();
    if (!an && !pl && !cn) return arr;
    return arr.filter((a) => {
      const name = (a.activity_name || "").toLowerCase();
      const loc = (a.location || "").toLowerCase();
      const ctry = (a.country_name || "").toLowerCase();
      if (an && !name.includes(an)) return false;
      if (pl && !loc.includes(pl)) return false;
      if (cn && !ctry.includes(cn)) return false;
      return true;
    });
  };

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(API_LIST);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setActivities(applyClientFilter(list));
    } catch (e) {
      setErr("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []); 

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!activityName.trim() && !place.trim() && !country.trim()) {
      fetchAll();
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const payload = {};
      if (activityName.trim()) payload.activity_name = activityName.trim();
      if (place.trim()) payload.location = place.trim();
      if (country.trim()) payload.country_name = country.trim();

      const res = await fetch(API_FILTER, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setActivities(applyClientFilter(list));
    } catch (e) {
      setErr("Failed to filter activities.");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setActivityName("");
    setPlace("");
    setCountry("");
    fetchAll();
  };

  const openActivityModal = (act) => {
    setSelectedActivity(act);
    setIsActivityModalOpen(true);
  };
  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setSelectedActivity(null);
  };

  const buildWhatsAppLink = (phone, aName, loc) => {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return null;
    const msg = `Hello, I'm interested in "${aName}"${loc ? ` in ${loc}` : ""}. Is it available?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  const SKELETON_COUNT = 9; 

  return (
    <div className="homepage-container">
      <div className="page-hero activities-hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div>
            <h1>Explore All Activities</h1>
            <p>Discover things to do around the world</p>
          </div>

          <form className="af-form" onSubmit={onSubmit}>
            <div className="af-field">
              <label className="af-label">Activity name</label>
              <input
                className="af-input"
                type="text"
                placeholder="Swimming, Golf…"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
            </div>

            <div className="af-field">
              <label className="af-label">Location</label>
              <input
                className="af-input"
                type="text"
                placeholder="City Center, Damascus…"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </div>

            <div className="af-field">
              <label className="af-label">Country</label>
              <input
                className="af-input"
                type="text"
                placeholder="Antigua"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <button type="submit" className="af-submit">Filter</button>
            <button type="button" className="af-clear" onClick={onClear}>Clear</button>
          </form>
        </div>
      </div>

      {/* النتائج / السكيليتون */}
      {err && !loading && (
        <div style={{ textAlign: "center", color: "#e74c3c" }}>{err}</div>
      )}

      <div className="activities-grid all">
        {loading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ActivityCardSkeleton key={`act-skel-${i}`} />
          ))
        ) : activities.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#475569" }}>
            No activities found.
          </div>
        ) : (
          activities.map((act, idx) => (
            <div
              key={act.id ?? `${act.activity_name}-${idx}`}
              className="activity-card"
              onClick={() => openActivityModal(act)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? openActivityModal(act) : null)}
            >
              <img
                src={getImageUrl(act.picture)}
                alt={act.activity_name}
                className="activity-img"
              />
              <div className="activity-overlay">
                <h3>{act.activity_name}</h3>
                <p>{act.owner_name || act.email || ""}</p>
                <p>
                  {act.location}
                  {act.country_name ? `, ${act.country_name}` : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isActivityModalOpen && selectedActivity && (
        <div className="modal-overlay" onClick={closeActivityModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="actModalTitle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="actModalTitle">Do you want to book this activity?</h3>
              <button className="modal-close" onClick={closeActivityModal} aria-label="Close">×</button>
            </div>

            <div className="modal-body">
              <p className="modal-title">{selectedActivity.activity_name}</p>
              <p className="modal-row"><strong>Owner:</strong> {selectedActivity.owner_name || "—"}</p>
              <p className="modal-row">
                <strong>Phone:</strong>{" "}
                {selectedActivity.phone_number ? (
                  <a href={`tel:${selectedActivity.phone_number}`}>{selectedActivity.phone_number}</a>
                ) : "—"}
              </p>
            </div>

            <div className="modal-actions">
              {selectedActivity.phone_number ? (
                <a
                  className="btn btn-whatsapp"
                  href={buildWhatsAppLink(
                    selectedActivity.phone_number,
                    selectedActivity.activity_name,
                    selectedActivity.location
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact on WhatsApp
                </a>
              ) : (
                <button className="btn btn-disabled" disabled>WhatsApp unavailable</button>
              )}
              <button className="btn btn-danger" onClick={closeActivityModal}>
                <FaTimes aria-hidden="true" /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
