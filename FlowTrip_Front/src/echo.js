import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { TOKEN } from "./Api/Api";


window.Pusher = Pusher;
window.Pusher.logToConsole = true;
const token = TOKEN;
const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_REVERB_APP_KEY,
  wsHost: process.env.REACT_APP_REVERB_HOST,
  wsPort: process.env.REACT_APP_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ["ws"],
  disableStats: true,
  cluster: "mt1",
  authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  },
});
echo.connector.pusher.connection.bind("connected", () => {
  console.log("✅ WebSocket connected!");
});

echo.connector.pusher.connection.bind("error", (err) => {
  console.error("❌ WebSocket error:", err);
});

echo.connector.pusher.connection.bind("disconnected", () => {
  console.log("⚠️ WebSocket disconnected");
});

export default echo;
