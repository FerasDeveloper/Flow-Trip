import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ConfirmDialog from "../Component/ConfirmDialog";
import Loader from "../Component/Loader";
import "./RoomDetails.css";
import { baseURL, DELETE_ROOM, EDIT_ROOM, SHOW_ROOM, TOKEN } from "../Api/Api";
import fallbackImage from "../Assets/AccommodationImagejpg.jpg";

export default function RoomDetails() {
  const location = useLocation();
  const { isAdmin } = location.state || {};
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletedPictures, setDeletedPictures] = useState([]);
  const [currentPictures, setCurrentPictures] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const token = TOKEN;

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/${SHOW_ROOM}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
        setCurrentPictures(res.data.pictures);
        setEditData({
          room_number: res.data.room.room_number,
          price: res.data.room.price,
          offer_price: res.data.room.offer_price || "",
          area: res.data.room.area,
          people_count: res.data.room.people_count,
          description: res.data.room.description,
          pictures: res.data.pictures,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePictureDelete = (pictureId) => {
    const pictureToDelete = currentPictures.find((pic) => pic.id === pictureId);

    if (pictureToDelete) {
      if (pictureToDelete.isNew) {
        URL.revokeObjectURL(pictureToDelete.room_picture);
      } else {
        setDeletedPictures((prev) => [...prev, pictureToDelete]);
      }

      setCurrentPictures((prev) => prev.filter((pic) => pic.id !== pictureId));
    }
  };

  const handlePictureUpload = (event) => {
    const files = Array.from(event.target.files);

    const newPictures = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      // for temporary show
      room_picture: URL.createObjectURL(file),
      file: file,
      isNew: true,
    }));

    setCurrentPictures((prev) => [...prev, ...newPictures]);

    event.target.value = "";
  };

  const handleSaveChanges = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();

      formData.append("room_number", editData.room_number);
      formData.append("price", editData.price);
      formData.append("area", editData.area);
      formData.append("people_count", editData.people_count);
      formData.append("description", editData.description);

      if (editData.offer_price && editData.offer_price !== "") {
        formData.append("offer_price", editData.offer_price);
      }

      const newPictures = currentPictures.filter((pic) => pic.isNew);
      const oldPictures = currentPictures.filter((pic) => !pic.isNew);

      newPictures.forEach((pic) => {
        formData.append("images[]", pic.file);
      });

      if (oldPictures.length > 0) {
        oldPictures.forEach((pic) => {
          formData.append("remaining_picture_ids[]", pic.id);
        });
      }

      if (deletedPictures.length > 0) {
        deletedPictures.forEach((pic) => {
          formData.append("deleted_picture_ids[]", pic.id);
        });
      }
      // if (deletedPictures.length > 0) {
      //   const deletedPictureIds = deletedPictures.map((pic) => pic.id);
      //   formData.append("deleted_picture_ids", JSON.stringify(deletedPictureIds));
      // }

      console.log("Saving changes with FormData:", {
        room_number: editData.room_number,
        price: editData.price,
        area: editData.area,
        people_count: editData.people_count,
        description: editData.description,
        offer_price: editData.offer_price,
        newImagesCount: newPictures.length,
        remainingPictureIds: oldPictures.map((pic) => pic.id),
        deletedPictureIds: deletedPictures.map((pic) => pic.id),
      });

      await axios
        .post(`${baseURL}/${EDIT_ROOM}/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // important for images
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => console.log(res.data));

      // delete temporary urls
      currentPictures.forEach((pic) => {
        if (pic.isNew && pic.room_picture) {
          URL.revokeObjectURL(pic.room_picture);
        }
      });

      setIsEditing(false);

      const res = await axios.get(`${baseURL}/${SHOW_ROOM}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
      setCurrentPictures(res.data.pictures);
      setEditData({
        room_number: res.data.room.room_number,
        price: res.data.room.price,
        offer_price: res.data.room.offer_price || "",
        area: res.data.room.area,
        people_count: res.data.room.people_count,
        description: res.data.room.description,
        pictures: res.data.pictures,
      });

      setDeletedPictures([]);
    } catch (err) {
      console.error("Error saving changes:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    currentPictures.forEach((pic) => {
      if (pic.isNew && pic.room_picture) {
        URL.revokeObjectURL(pic.room_picture);
      }
    });

    setCurrentPictures(data.pictures);

    setDeletedPictures([]);

    setIsEditing(false);
    if (data) {
      setEditData({
        room_number: data.room.room_number,
        price: data.room.price,
        offer_price: data.room.offer_price || "",
        area: data.room.area,
        people_count: data.room.people_count,
        description: data.room.description,
        pictures: data.pictures,
      });
    }
  };

  const handleDeleteRoom = async () => {
    setDeleteLoading(true);
    try {
      await axios.get(`${baseURL}/${DELETE_ROOM}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/Accommodation/dashboard/rooms");
    } catch (err) {
      alert(
        "Error deleting room: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="room-details-error">{error}</div>;
  if (!data) return null;

  const { room, pictures } = data;

  if (isEditing) {
    return (
      <div className="room-details-edit-container">
        <div className="room-details-edit-header">
          <h2>Room {room.id} Editing</h2>
          <div className="room-details-edit-actions">
            <button
              className="room-details-edit-btn room-details-cancel"
              onClick={handleCancelEdit}
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              className="room-details-edit-btn room-details-save"
              onClick={handleSaveChanges}
              disabled={editLoading}
            >
              {editLoading ? "Saving.." : "Save"}
            </button>
          </div>
        </div>

        <div className="room-details-edit-content">
          <div className="room-details-edit-form-section">
            <h3>Room Information</h3>
            <div className="room-details-inputbox">
              <input
                required="required"
                type="number"
                placeholder=""
                value={editData.room_number}
                onChange={(e) =>
                  handleInputChange("room_number", parseInt(e.target.value))
                }
              />
              <span>Room Number</span>
              <i></i>
            </div>
            <div className="room-details-inputbox">
              <input
                required="required"
                type="number"
                placeholder=""
                value={editData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value))
                }
              />
              <span>Price</span>
              <i></i>
            </div>
            <div className="room-details-inputbox">
              <input
                type="number"
                required="required"
                placeholder=""
                value={editData.offer_price === "" ? "" : editData.offer_price}
                onChange={(e) =>
                  handleInputChange(
                    "offer_price",
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
              />
              <span>Offer Price (Optinal)</span>
              <i></i>
            </div>
            <div className="room-details-inputbox">
              <input
                required="required"
                type="number"
                placeholder=""
                value={editData.area}
                onChange={(e) =>
                  handleInputChange("area", parseFloat(e.target.value))
                }
              />
              <span>Area</span>
              <i></i>
            </div>
            <div className="room-details-inputbox">
              <input
                required="required"
                type="number"
                placeholder=""
                value={editData.people_count}
                onChange={(e) =>
                  handleInputChange("people_count", parseInt(e.target.value))
                }
              />
              <span>Person's number</span>
              <i></i>
            </div>
            <div className="room-details-form-group">
              <label>Description:</label>
              <textarea
                className="room-details-description"
                value={editData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Room description"
                rows="4"
              />
            </div>
          </div>

          <div className="room-details-edit-pictures-section">
            <h3>Room's Photos</h3>
            <div className="room-details-pictures-grid">
              {currentPictures.map((pic) => (
                <div key={pic.id} className="room-details-picture-item">
                  <img
                    src={
                      pic.isNew
                        ? pic.room_picture
                        : pic.room_picture.startsWith("http")
                        ? pic.room_picture
                        : `http://localhost:8000/${pic.room_picture}`
                    }
                    alt={`Room picture ${pic.id}`}
                  />
                  <button
                    className="room-details-delete-picture-btn"
                    onClick={() => handlePictureDelete(pic.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="room-details-add-picture-section">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePictureUpload}
                id="picture-upload"
                style={{ display: "none" }}
              />
              <label
                htmlFor="picture-upload"
                className="room-details-add-picture-btn"
              >
                Add Photo
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-details-container">
      {!isAdmin && (
        <button
          className="room-details-floating-edit-btn"
          onClick={() => setIsEditing(true)}
          title="Edit Room"
        >
          <i className="fa-solid fa-edit"></i>
        </button>
      )}
      {!isAdmin && (
        <button
          className="room-details-floating-delete-btn"
          style={{ bottom: 80 }}
          onClick={() => setShowDeleteDialog(true)}
          title="Delete Room"
          disabled={deleteLoading}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      )}
      {showDeleteDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this room? This action cannot be undone."
          onConfirm={handleDeleteRoom}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      <div
        className={`room-details-pictures-section ${
          !pictures || pictures.length === 0 ? "room-details-no-pictures" : ""
        }`}
        style={{ width: "85%" }}
      >
        <h2 className="room-details-pictures-title">Pictures</h2>
        <div
          className={`room-details-css-slider-container ${
            pictures && pictures.length <= 3 ? "room-details-no-animation" : ""
          } ${
            !pictures || pictures.length === 0
              ? "room-details-empty-container"
              : ""
          }`}
        >
          <div className="room-details-css-slider-track">
            {pictures && pictures.length > 0 ? (
              <>
                {pictures.map((pic, idx) => (
                  <div
                    className="room-details-css-slide"
                    key={`original-${idx}`}
                  >
                    <img
                      src={
                        pic.room_picture.startsWith("http")
                          ? pic.room_picture
                          : `http://localhost:8000/${pic.room_picture}`
                      }
                      alt={`Room pic ${idx + 1}`}
                    />
                  </div>
                ))}
                {/* Duplicate images for seamless loop - only if more than 3 images */}
                {pictures.length > 3 &&
                  pictures.map((pic, idx) => (
                    <div
                      className="room-details-css-slide"
                      key={`duplicate-${idx}`}
                    >
                      <img
                        src={
                          pic.room_picture.startsWith("http")
                            ? pic.room_picture
                            : `http://localhost:8000/${pic.room_picture}`
                        }
                        alt={`Room pic ${idx + 1}`}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <div className="room-details-no-images">
                <span>No Images Available</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="room-details-card"
        style={{ maxWidth: 600, width: "100%" }}
      >
        <h2 className="room-details-title">Room Details</h2>
        <div className="room-details-section">
          <b>ID:</b> {room.room_number}
        </div>
        <div className="room-details-section">
          <b>Price:</b>{" "}
          {room.offer_price !== null &&
          room.offer_price !== "" &&
          room.offer_price !== 0.0 ? (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#b23c3c",
                  marginRight: 8,
                }}
              >
                {room.price}$
              </span>
              <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                {room.offer_price}$
              </span>
            </>
          ) : (
            <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
              {room.price}$
            </span>
          )}
        </div>
        <div className="room-details-section">
          <b>Area:</b> {room.area} m²
        </div>
        <div className="room-details-section">
          <b>People Count:</b> {room.people_count}
        </div>
        <div className="room-details-section">
          <b>Description:</b> {room.description}
        </div>
      </div>
    </div>
  );
}
