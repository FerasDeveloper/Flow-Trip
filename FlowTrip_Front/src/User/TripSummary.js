import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TripSummary.css";
import { baseURL, MAKEITINERARY } from "../Api/Api";
import TripSummarySkeleton from "./TripSummarySkeleton";

export default function TripSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, days, budget } = location.state || {};

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!destination || !days || !budget) {
      setError("Please go back and fill out the form first.");
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const res = await fetch(`${baseURL}/${MAKEITINERARY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination,
            days,
            budget,
            style: "adventurous",
            lang: "ar"
          }),
        });
        if (!res.ok) throw new Error("Failed to bring flight plan");
        const data = await res.json();
        setPlan(data.plan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [destination, days, budget]);

  return (
    <>
      {loading && <TripSummarySkeleton days={days} />}
      {error && (
        <div className="summary-container">
          <p className="error">{error}</p>
        </div>
      )}

      {plan && (
        <div className="summary-container">
          <h1 className="title"><i className="fa-solid fa-plane-departure"></i> {plan.title}</h1>
          <p className="summary">{plan.summary}</p>

          <div className="budget-box">
            <i className="fa-solid fa-money-bill-wave"></i>
            الميزانية التقديرية: {plan.estimated_budget.amount_per_person} {plan.estimated_budget.currency} للشخص
          </div>

          {plan.days.map((day) => (
            <div key={day.day} className="day-card">
              <h2>اليوم {day.day} - {day.theme}</h2>
              <div className="session">
                <h3><i className="fa-solid fa-sun"></i> صباحاً</h3>
                <ul>{day.morning.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </div>
              <div className="session">
                <h3><i className="fa-solid fa-cloud-sun"></i> بعد الظهر</h3>
                <ul>{day.afternoon.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
              <div className="session">
                <h3><i className="fa-solid fa-moon"></i> مساءً</h3>
                <ul>{day.evening.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
              <p className="notes"><i className="fa-solid fa-note-sticky"></i> {day.notes}</p>
            </div>
          ))}

          <div className="tips-box">
            <h2><i className="fa-solid fa-lightbulb"></i> نصائح السفر</h2>
            <ul>
              {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

          <button className="back-btn" onClick={() => navigate("/trip",{ replace: true })}>
            <i className="fa-solid fa-arrow-left"></i> رجوع
          </button>
        </div>
      )}
    </>
  );
}