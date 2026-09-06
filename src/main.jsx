import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import InfiniteApp from "./infinite/InfiniteApp.jsx";
import VerseApp from "./verse/VerseApp.jsx";
import TwentySixApp from "./twentysix/TwentySixApp.jsx";
import Resume from "./Resume.jsx";
import OkuriSupport from "./OkuriSupport.jsx";
import OkuriPrivacyPolicy from "./OkuriPrivacyPolicy.jsx";
import OkuriTerms from "./OkuriTerms.jsx";
import "./css/base.css";
import "./css/style.css";
import "./css/resume.css";

const path = window.location.pathname;

// ─── TEMPORARY: funnel every visitor to /26 ──────────────────────────────────
// While this is true, ANY path on ANY domain or subdomain serving this app renders
// /26 and the address bar is rewritten to /26. Nothing else is changed — flip this
// single flag to false to restore normal routing exactly as it was.
const FORCE_26 = true;

// …except these. OKURI's App Store listing and the app itself link straight to the
// legal pages, so funnelling them would break a live App Store requirement.
const FORCE_26_EXEMPT = ["/okuri-privacy-policy", "/okuri-terms", "/okuri-support"];

const forced = FORCE_26 && !FORCE_26_EXEMPT.includes(path);
if (forced && path !== "/26") {
    window.history.replaceState(null, "", "/26");
}
// ─── end temporary block ─────────────────────────────────────────────────────

const Page = forced ? TwentySixApp :
    path === "/resume" ? Resume :
    path === "/infinite" ? InfiniteApp :
    path === "/infinite-wip" ? () => <InfiniteApp isWip={true} /> :
    path === "/verse" ? VerseApp :
    path === "/26" ? TwentySixApp :
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
