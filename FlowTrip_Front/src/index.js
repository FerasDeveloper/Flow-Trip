import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./css/all.min.css";
import "./Assets/all.min.css"
import { BrowserRouter } from "react-router-dom";

import { colors } from "./Component/Color.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootStyle = document.documentElement;
Object.entries(colors).forEach(([key, value]) => {
  rootStyle.style.setProperty(`--${key}`, value);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="562353866517-3mqla74u2kr7h67hakm5t3k5v3dleo23.apps.googleusercontent.com">

  <BrowserRouter>
    <App />
  </BrowserRouter>
  </GoogleOAuthProvider>

);