import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Activity.css";
import Button from "../Component/AddButton";
import ActivityCard from "../Component/ActivityCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_ACTIVITY, baseURL, DELETE_ACTIVITY, GET_ALL_ACTIVITY, TOKEN } from "../Api/Api";
import ActivitySkeleton from "../Component/ActivitySkeleton";


const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [confirmDeleteData, setConfirmDeleteData] = useState(null);
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const token = TOKEN;

  const fetchActivities = () => {
    setLoading(true);
    axios
      .get(`${baseURL}/${GET_ALL_ACTIVITY}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetched = response.data.data.map((act) => ({
          id: act.id,
          text: act.name,
        }));
        setActivities(fetched);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = (id, name) => {
    setConfirmDeleteData({ id, name });
  };

  const confirmDelete = () => {
    const { id, name } = confirmDeleteData;
    axios
      .delete(`${baseURL}/${DELETE_ACTIVITY}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("deleted Successfully");
        setActivities((prev) => prev.filter((act) => act.id !== id));
      })
      .catch((error) => {
        toast.error(error);
        console.error(error);
      })
      .finally(() => {
        setConfirmDeleteData(null);
      });
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleAddActivity = () => {
    if (newActivityName.trim() === "") {
      toast.error("Enter activity name");
      return;
    }

    axios
      .post(
        `${baseURL}/${ADD_ACTIVITY}`,
        { name: newActivityName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Success");
        setNewActivityName("");
        setShowModal(false);
        fetchActivities();
      })
      .catch((error) => {
        toast.error(`${error.message}`);
        console.log(error.message);
      });
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="activity-page">
      <ToastContainer />

      <div className="activity-header">
        <Button onClick={handleAddClick} text="Add Activity" />
      </div>

      {/* <div className="activity-row">
        {activities.map((act) => (
          <ActivityCard
            key={act.id}
            id={act.id}
            text={act.text}
            onDelete={() => handleDelete(act.id, act.text)} 
          />
        ))}
      </div> */}
      {loading ? (
        <ActivitySkeleton />
      ) : (
        <div className="activity-row">
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              id={act.id}
              text={act.text}
              onDelete={() => handleDelete(act.id, act.text)}
            />
          ))}
        </div>
      )}


      {showModal && (
        <div className="activity-modal-overlay">
          <div className="activity-modal-content" ref={modalRef}>
            <h2>Add a new activity</h2>
            <input
              type="text"
              placeholder="Enter the activity name"
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
            />
            <div className="activity-modal-buttons">
              <button
                className="activity-animated-btn"
                onClick={handleAddActivity}
              >
                Add
              </button>
              <button
                className="activity-animated-btn activity-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteData !== null && (
        <div className="activity-modal-overlay">
          <div className="activity-modal-content">
            <h2>Confirm deletion</h2>
            <p style={{ marginBottom: "15px" }}>Are you sure you want to delete the activity: "{confirmDeleteData.name}"?</p>
            <div className="activity-modal-buttons">
              <button className="activity-animated-btn" onClick={confirmDelete}>
                Yes, delete
              </button>
              <button
                className="activity-animated-btn activity-cancel"
                onClick={() => setConfirmDeleteData(null)}
              >
                cancell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
