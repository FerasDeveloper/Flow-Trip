import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ShowRecordsContainer from "../Component/ShowRecordsContainer";
import {
  baseURL,
  SHOW_ACCOMMODATION_RECORDS,
  SHOW_ROOM_RECORDS,
  FILTER_NAME_ACCOMMODATIOM,
  TOKEN,
} from "../Api/Api";

export default function ShowRecords() {
  const [records, setRecords] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomRecords, setRoomRecords] = useState([]);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalRecords, setOriginalRecords] = useState([]);
  const [originalRoomRecords, setOriginalRoomRecords] = useState([]);
  const role = localStorage.getItem('role') || Cookies.get('role') || '';

  useEffect(() => {
    const checkUserType = async () => {
      try {
        setLoading(true);
        if (role === "Hotel") {
          await fetchRoomsData();
        } else {
          await fetchBookingRecords();
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error(err);
      }
    };
    checkUserType();
  }, []);

  const fetchRoomsData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/${SHOW_ACCOMMODATION_RECORDS}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      setRooms(response.data.rooms);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const fetchBookingRecords = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/${SHOW_ACCOMMODATION_RECORDS}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      setRecords(response.data.details);
      setOriginalRecords(response.data.details);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const handleRoomClick = async (roomId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/${SHOW_ROOM_RECORDS}/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      setSelectedRoom(rooms.find((room) => room.id === roomId));
      setRoomRecords(response.data);
      setOriginalRoomRecords(response.data);
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
    if (!query.trim()) {
      if (role === "Hotel" && showRoomDetails) {
        setRoomRecords(originalRoomRecords);
      } else if (role !== "Hotel") {
        setRecords(originalRecords);
      }
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/${FILTER_NAME_ACCOMMODATIOM}`,
        {
          name: query,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let filteredData = [];
      if (
        response.data &&
        response.data.filtered_users &&
        Array.isArray(response.data.filtered_users)
      ) {
        filteredData = response.data.filtered_users;
      } else if (response.data && Array.isArray(response.data)) {
        filteredData = response.data;
      } else if (
        response.data &&
        response.data.details &&
        Array.isArray(response.data.details)
      ) {
        filteredData = response.data.details;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        filteredData = response.data.data;
      }
      if (role === "Hotel" && showRoomDetails) {
        const filteredRoomRecords = originalRoomRecords.filter((record) =>
          filteredData.some((user) => user.id === record.user.id)
        );
        setRoomRecords(filteredRoomRecords);
      } else if (role !== "Hotel") {
        const filteredBookingRecords = originalRecords.filter((record) =>
          filteredData.some((user) => user.id === record.user.id)
        );
        setRecords(filteredBookingRecords);
      }
    } catch (err) {
      console.error("Error filtering records:", err);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <ShowRecordsContainer
      loading={loading}
      error={error}
      userType={role}
      showRoomDetails={showRoomDetails}
      selectedRoom={selectedRoom}
      rooms={rooms}
      records={records}
      roomRecords={roomRecords}
      handleRoomClick={handleRoomClick}
      handleBackToRooms={handleBackToRooms}
      searchQuery={searchQuery}
      handleInputChange={handleInputChange}
      handleSearch={handleSearch}
      advanced={false}
      customTitle="Booking Archieve"
      isrecords={true}
    />
  );
}
