import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import OkuriSupport from "./OkuriSupport.jsx";
import "./css/base.css";
import "./css/style.css";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")).render(
    path === "/okuri-support" ? <OkuriSupport /> : <App />
);
