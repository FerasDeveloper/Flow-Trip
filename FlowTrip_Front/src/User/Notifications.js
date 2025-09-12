// src/pages/Notifications.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import echo from "../echo";
import "./Notifications.css";
import {
  baseURL,
  GET_NEW_NOTIFICATIONS_COUNT,
  TOKEN,
  USERID,
} from "../Api/Api";
import { toast } from "react-toastify";
import Cookies from "js-cookie"

export default function Notifications() {
  const [unreadList, setUnreadList] = useState([]);
  const [readList, setReadList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevCountRef = useRef(0);

  const userId = Cookies.get("user_id") || localStorage.getItem("user_id");
  const token = Cookies.get("token")||localStorage.getItem("token");
 
  const fetchAll = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/GetAllNotifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const all = res.data?.notificatios || [];
      setUnreadList(all.filter((n) => n.message_status === 0));
      setReadList(all.filter((n) => n.message_status === 1));
      setUnreadCount(all.filter((n) => n.message_status === 0).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  }, []);
useEffect(() => {
  fetchAll();
  prevCountRef.current = unreadCount;
}, []); 
  useEffect(() => {
   if (prevCountRef.current > unreadCount) {
     fetchAll(); 
   }
   prevCountRef.current = unreadCount;
  }, [fetchAll,unreadCount]);

  const fetchNewNotifiactionsCount = async () => {
    try {
      const res = await axios.get(`${baseURL}/${GET_NEW_NOTIFICATIONS_COUNT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)
      setUnreadCount(res.data.count);
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    if (!userId) return;
    const channel = echo.private(`user.${userId}`);
    channel.listen(".notification.sent", (e) => {
      const notif = {
        id: e.id,
        message: e.message,
        };

      setUnreadList((prev) => [notif, ...prev]);
      fetchNewNotifiactionsCount()
    });
    return () => {
      echo.leave(`user.${userId}`);
    };
  }, [userId]);

  return (
    <div className="notify-wrap">
      <div className="notify-head">
        <h1 className="notify-title">Notifications</h1>
        <div className="notify-badge" aria-label="unread count">
          {unreadCount}
        </div>
      </div>

      <section className="notify-section">
        <header className="notify-section-head">
          <h2>New Notifications</h2>
        </header>
        {unreadList.length === 0 ? (
          <div className="notify-empty">No new notifications</div>
        ) : (
          <div className="notify-list">
            {unreadList.map((n) => (
              <article className="notify-card is-new" key={`new-${n.id}`}>
                <div className="notify-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"></path>
                  </svg>
                </div>
                <div className="notify-content">
                  <div className="notify-text">{n.message}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="notify-section">
        <header className="notify-section-head">
          <h2>Old Notifications</h2>
        </header>
        {readList.length === 0 ? (
          <div className="notify-empty">No old notifications</div>
        ) : (
          <div className="notify-list">
            {readList.map((n) => (
              <article className="notify-card" key={`old-${n.id}`}>
                <div className="notify-icon is-muted">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"></path>
                  </svg>
                </div>
                <div className="notify-content">
                  <div className="notify-text">{n.message}</div>
                  {n.created_at && (
                    <div className="notify-time">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
