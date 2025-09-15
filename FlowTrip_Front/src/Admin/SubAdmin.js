import axios from "axios";
import { useEffect, useState } from "react";
import SubAdminCard from "../Component/SubAdminCard";
import SubAdminCardSkeleton from "../Component/SubAdminCardSkeleton";
import ConfirmDialog from "../Component/ConfirmDialog";
import "./OwnerSearch.css";
import {
  baseURL,
  FILTER_SUBADMINS,
  GET_ALL_SUBADMIN,
  GET_ALL_UESER,
  REMOVE_SUBADMIN,
  TOKEN,
} from "../Api/Api";

export default function SubAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);


  const token = TOKEN;

  useEffect(() => {
    const loadInfo = async () => {
      await axios
        .get(`${baseURL}/${GET_ALL_SUBADMIN}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsers(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    };
    loadInfo();
  }, []);

  const handleRemoveSubAdmin = (userId) => {
    setSelectedUserId(userId);
    setShowConfirmDialog(true);
  };

  const removeSubAdmin = async () => {
    try {
      setLoading(true);
      await axios.get(`${baseURL}/${REMOVE_SUBADMIN}/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await axios.get(`${baseURL}/${GET_ALL_SUBADMIN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error removing sub admin:", err);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
      setSelectedUserId(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirmDialog(false);
    setSelectedUserId(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      setUsers([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${baseURL}/${FILTER_SUBADMINS}`,
        {
          name: search,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const reloadAllUsers = async (
    clearCountry = false,
    clearCategory = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseURL}/${GET_ALL_UESER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fs">
        <div className="owner-flex w-100">
          <div className="search-flex users">
            <div className="owner-input-container">
              <input
                placeholder="Enter name"
                type="text"
                disabled
              />
            </div>
            <button className="owner-search-button users" disabled>
              <svg viewBox="0 0 512 512" className="svgIcon">
                <path d="M505 442.7L405.3 343c28.4-34.9 45.5-79 45.5-127C450.8 96.5 354.3 0 225.4 0S0 96.5 0 216.1s96.5 216.1 216.1 216.1c48 0 92.1-17.1 127-45.5l99.7 99.7c4.5 4.5 10.6 7 17 7s12.5-2.5 17-7c9.4-9.4 9.4-24.6 0-34zM216.1 392.2c-97.2 0-176.1-78.9-176.1-176.1S118.9 39.9 216.1 39.9s176.1 78.9 176.1 176.1-78.9 176.1-176.1 176.1z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="owner-list-container">
          {Array.from({ length: 6 }).map((_, index) => (
            <SubAdminCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="owner-error">{error}</div>;
  }

  return (
    <div className="fs">
      <div className="owner-flex w-100">
        <div className="search-flex users">
          <div className="owner-input-container">
            <input
              placeholder="Enter name"
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                console.log(value)
                setSearch(value);
                if (value === "") {
                  reloadAllUsers();
                }
              }}
            />
          </div>
          <button className="owner-search-button users" onClick={handleSearch}>
            <svg viewBox="0 0 512 512" className="svgIcon">
              <path d="M505 442.7L405.3 343c28.4-34.9 45.5-79 45.5-127C450.8 96.5 354.3 0 225.4 0S0 96.5 0 216.1s96.5 216.1 216.1 216.1c48 0 92.1-17.1 127-45.5l99.7 99.7c4.5 4.5 10.6 7 17 7s12.5-2.5 17-7c9.4-9.4 9.4-24.6 0-34zM216.1 392.2c-97.2 0-176.1-78.9-176.1-176.1S118.9 39.9 216.1 39.9s176.1 78.9 176.1 176.1-78.9 176.1-176.1 176.1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="owner-list-container">
        {users.map((item, idx) => (
          <SubAdminCard
            key={item.id}
            name={item.name}
            email={item.email}
            phoneNumber={item.phone_number}
            style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
            onClick={() => handleRemoveSubAdmin(item.id)}
            buttonText="Remove SubAdmin"
          />
        ))}
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          message="Do you want to make this user as normal user?"
          onConfirm={removeSubAdmin}
          onCancel={cancelRemove}
          color="true"
        />
      )}
    </div>
  );
}
