import { useState, useEffect } from "react";
import axios from "axios";
import ShowRecordsContainer from "../Component/ShowRecordsContainer";
import "./Advanced.css";
import { TOKEN } from "../Api/Api";
import Cookies from "js-cookie";
 
export default function Advanced() {
  const [view, setView] = useState("popular");

  const urlMap = {
    popular: "http://127.0.0.1:8000/api/ShowPopularAccommodationRecords",
    oldest: "http://127.0.0.1:8000/api/ShowOldAccommodationRecords",
    newest: "http://127.0.0.1:8000/api/ShowNewAccommodationRecords",
  };

  const [baseUrl, setBaseUrl] = useState(urlMap[view]);
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [originalRoomRecords, setOriginalRoomRecords] = useState([]);
  const [roomRecords, setRoomRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userType = Cookies.get("role");

  useEffect(() => {
    setBaseUrl(urlMap[view] || urlMap.popular);
  }, [view]);

  useEffect(() => {
    if (userType === "Hotel") {
      fetchRoomsData();
    } else {
      fetchBookingRecords();
    }
  }, [userType, baseUrl]);

  const fetchRoomsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setRooms(response.data.rooms);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(err);
    }
  };

  const fetchBookingRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setRecords(response.data.months);
      setOriginalRecords(response.data.months);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(err);
    }
  };

  const handleRoomClick = async (roomId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/ShowRoomRecords/${roomId}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      setSelectedRoom(rooms.find((r) => r.id === roomId));
      setRoomRecords(data);
      setOriginalRoomRecords(data);
      setShowRoomDetails(true);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(err);
    }
  };

  const handleBackToRooms = () => {
    setShowRoomDetails(false);
    setSelectedRoom(null);
    setRoomRecords([]);
    setOriginalRoomRecords([]);
    setSearchQuery("");
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      if (userType === "Hotel" && showRoomDetails) {
        setRoomRecords(originalRoomRecords);
      } else {
        setRecords(originalRecords);
      }
      return;
    }

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/FilterNameAccommodation",
        { name: query },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      let filtered = [];
      if (Array.isArray(data.filtered_users)) filtered = data.filtered_users;
      else if (Array.isArray(data)) filtered = data;
      else if (Array.isArray(data.details)) filtered = data.details;
      else if (Array.isArray(data.data)) filtered = data.data;

      if (userType === "Hotel" && showRoomDetails) {
        const roomFiltered = originalRoomRecords.filter((r) =>
          filtered.some((u) => u.id === r.user.id)
        );
        setRoomRecords(roomFiltered);
      } else {
        const bookingFiltered = originalRecords.filter((r) =>
          filtered.some((u) => u.id === r.user.id)
        );
        setRecords(bookingFiltered);
      }
    } catch (err) {
      console.error("Error filtering records:", err);
    }
  };
  return (
    <ShowRecordsContainer
      loading={loading}
      error={error}
      userType={userType}
      showRoomDetails={showRoomDetails}
      selectedRoom={selectedRoom}
      rooms={rooms}
      records={records}
      roomRecords={roomRecords}
      handleRoomClick={handleRoomClick}
      handleBackToRooms={handleBackToRooms}
      searchQuery={searchQuery}
      handleInputChange={(e) => handleSearch(e.target.value)}
      handleSearch={() => handleSearch(searchQuery)}
      customTitle="Booking Archive"
      btnn={true}
      view={view}
      setView={setView}
      advanced={true}
      isrecords={true}
    />
  );
}
