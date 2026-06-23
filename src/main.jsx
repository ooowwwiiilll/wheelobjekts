import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import Resume from "./Resume.jsx";
import OkuriSupport from "./OkuriSupport.jsx";
import OkuriPrivacyPolicy from "./OkuriPrivacyPolicy.jsx";
import OkuriTerms from "./OkuriTerms.jsx";
import "./css/base.css";
import "./css/style.css";
import "./css/resume.css";

const path = window.location.pathname;

const Page =
    path === "/resume" ? Resume :
    path === "/okuri-support" ? OkuriSupport :
        path === "/okuri-privacy-policy" ? OkuriPrivacyPolicy :
            path === "/okuri-terms" ? OkuriTerms :
                path === "/wip" ? () => <App isWip={true} /> : App;

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <Page />
        <Analytics />
    </>
);
