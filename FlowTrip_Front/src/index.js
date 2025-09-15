import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./css/all.min.css";
import "./Assets/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

import { colors } from "./Component/Color.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

const rootStyle = document.documentElement;
Object.entries(colors).forEach(([key, value]) => {
  rootStyle.style.setProperty(`--${key}`, value);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="562353866517-3mqla74u2kr7h67hakm5t3k5v3dleo23.apps.googleusercontent.com">
    <ToastContainer
      position="top-right"
      autoClose={5000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
