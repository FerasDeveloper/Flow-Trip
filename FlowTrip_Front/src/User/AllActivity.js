import React, { useEffect, useState } from "react";
import ActivityCardSkeleton from "../Component/ActivityCardSkeleton";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";
import "./AllActivity.css";

const API_LIST = "http://127.0.0.1:8000/api/getActivity";
const API_FILTER = "http://127.0.0.1:8000/api/filterActivities";

export default function AllAcyivit() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const [activityName, setActivityName] = useState("");
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");

  
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

const getImageUrl = (picture) => {
  // 1) حالات null/undefined/""/"null"/"undefined"
  if (!picture || picture === "null" || picture === "undefined") return FALLBACK_IMG;

  // 2) توحيد السلاشات
  const p = String(picture).replace(/\\/g, "/").trim();

  // 3) إذا الرابط كامل http/https رجّعو كما هو
  if (/^https?:\/\//i.test(p)) return p;

  // 4) إذا إجا مثل "storage/images/file.jpg" أو "/storage/images/file.jpg"
  //    خليه يشير للسيرفر تبعك
  if (p.includes("storage/")) {
    const fileName = p.split("/").pop();
    return `http://127.0.0.1:8000/storage/images/${fileName}`;
  }

  // 5) أي شي غير هيك: جرّب اعتباره اسم ملف موجود بمجلد التخزين
  const fileName = p.split("/").pop();
  return `http://127.0.0.1:8000/storage/images/${fileName}`;
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
        onClick={() =>
          navigate(`/owner_profile/${act.owner_id}`, {
            state: { readOnly: true, ownerId: act.owner_id },
          })
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/owner_profile/${act.owner_id}`, {
              state: { readOnly: true, ownerId: act.owner_id },
            });
          }
        }}
        title="View owner profile"
      >
        <img
          src={getImageUrl(act.picture)}
          alt={act.activity_name}
          className="activity-img"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
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


     
    </div>
  );
}
