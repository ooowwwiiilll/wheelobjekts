import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import OkuriSupport from "./OkuriSupport.jsx";
import OkuriPrivacyPolicy from "./OkuriPrivacyPolicy.jsx";
import OkuriTerms from "./OkuriTerms.jsx";
import "./css/base.css";
import "./css/style.css";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")).render(
    path === "/okuri-support" ? <OkuriSupport /> :
        path === "/okuri-privacy-policy" ? <OkuriPrivacyPolicy /> :
            path === "/okuri-terms" ? <OkuriTerms /> : <App />
);
