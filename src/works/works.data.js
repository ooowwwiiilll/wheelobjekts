// ─────────────────────────────────────────────────────────────────────────────
// /works — CONTENT. Self-contained, exactly like /26: shared facts (title,
// region, year, category) are read out of content/items.js so the registry stays
// the one source of truth, and everything /works-only lives in the list below.
//
//   label   the full project name (uppercase is applied in CSS)
//   lead    the part of the label set in the serif — the brand. Everything after
//           it is the qualifier and sets in the sans, which is the pairing in the
//           reference. Omit it and the whole label is serif.
//   hero    the ONE image that fills the 1×1 cursor chip and then grounds the
//           sidebar. Stills only — the chip is a mask, a video in it reads badly.
//   body    extra media stacked down the sidebar's scroll
//
// Order here is the order on the page. `id` keys into content/items.js; an entry
// may carry its own `meta` instead if it exists only on /works.
// ─────────────────────────────────────────────────────────────────────────────

import { itemById, CATEGORY_LABEL } from "../content/items.js";

const source = [
  {
    id: "13",
    label: "KFC Global",
    lead: "KFC",
    color: "#BE2A2A",
    subtitle: "Nothing beats the original",
    discipline: "Design system • Digital channel rebrand",
    blurb: "A global multi-brand design system overhaul under Yum! Brands.",
    hero: "/skfc_thumb.webp",
    body: [],
  },
  {
    id: "6",
    label: "Okuri",
    subtitle: "Overengineered himekuri calendar",
    discipline: "Visual arts • Utility",
    blurb:
      "A digital tear-off calendar inspired by the traditional Japanese himekuri, with an over-engineered contemporary spin. Swipe to flip a new sheet each day.",
    // HERO PENDING — replacement image not supplied yet, so this is still the old one.
    hero: "/xokuri_web.webp",
    // Matches the main site's detail body, which leads with the video.
    body: [
      "/xokuri_web.mp4",
      "/mokuri1_web.webp",
      "/mokuri2_web.webp",
      "/wn1_web.webp",
      "/wn2_web.webp",
      "/wn3_web.webp",
    ],
  },
  {
    id: "10",
    label: "Blooms The Chemist",
    color: "#B5B5B5",
    lead: "Blooms",
    subtitle: "",
    discipline: "Web development",
    blurb:
      "An Australian retail pharmacy group and certified B Corp, offering health & wellness prescriptions, pharmacist consultations and medication ordering.",
    hero: "/szbloom_web.webp",
    body: [],
  },
  {
    id: "9",
    hidden: true,
    label: "Samosynth",
    color: "#3A2B2B",
    subtitle: "",
    discipline: "Music development app",
    blurb:
      "A mini MPC / sampler celebrating Bataknese culture, mixing hip-hop drum samples with processed taganing, kulcapi and gordang one-shots.",
    hero: "/ssamo_web.webp",
    body: ["/ssamo_dsimulator_web.webp", "/ssamo_dgrid_web.webp"],
  },
  {
    id: "12",
    label: "Telkomsel Enterprise",
    lead: "Telkomsel",
    subtitle: "Ted",
    discipline: "Product design",
    blurb:
      "The B2B unit of Telkomsel providing digital solutions and connectivity for corporations — network services, collaboration tools, IoT and CX insights.",
    hero: "/szted_web.webp",
    body: [],
  },
  {
    id: "3",
    label: "GoPay",
    subtitle: "",
    discipline: "Product design",
    blurb:
      "A recent GoPay digital wallet service integration for Telkomsel users via the MyTelkomsel app, offering convenience and efficiency in transacting Telkomsel services.",
    hero: "/sgop_web.webp",
    body: [],
  },
  {
    id: "8",
    label: "Thanh Uy Art & Coffee",
    color: "#8C8C8C",
    lead: "Thanh Uy",
    subtitle: "Art gallery & coffee",
    discipline: "Visual arts",
    blurb:
      "An edgy printmaking gallery, studio and coffee shop in Ha Noi, celebrating Vietnam's propaganda and renewal period through traditional & contemporary paintings.",
    hero: "/sthuy_web.webp",
    body: [],
  },
  {
    id: "5",
    hidden: true,
    label: "MyTelkomsel Basic",
    color: "#3D5A27",
    lead: "MyTelkomsel",
    subtitle: "",
    discipline: "Product design",
    blurb:
      "A lightweight Telkomsel app for users with limited memory or unstable connections — balance monitoring, package shop and payments.",
    hero: "/smtb_web.webp",
    body: [],
  },
  {
    id: "4",
    hidden: true,
    label: "KIX",
    subtitle: "Interactive hoop shoes finder",
    discipline: "Interactive 3D app",
    blurb: "A Swift Playground built for WWDC, featured on WWDC Scholars.",
    hero: "/skix_web.webp",
    body: [],
  },
  {
    id: "2",
    hidden: true,
    label: "Vietinbank",
    color: "#1B6BA5",
    subtitle: "eFAST",
    discipline: "Product design",
    blurb: "Corporate digital banking for one of Vietnam's big four.",
    hero: "/sfast_web.webp",
    body: [],
  },
];
// Fold the shared registry in once, at module load, so nothing looks it up per render.
export const projects = source
  .filter((p) => !p.hidden)
  .map((p) => {
    const meta = p.meta ?? itemById(p.id) ?? {};
    const lead = p.lead ?? p.label;
    return {
      ...p,
      meta,
      lead,
      // the qualifier: whatever the serif half leaves behind
      tail: p.lead ? p.label.slice(p.lead.length).trim() : "",
      // the sidebar's fact rows, empties dropped so a sparse project shows no holes
      facts: [
        ["region", meta.region],
        ["year", meta.year],
        ["discipline", p.discipline],
        ["type", CATEGORY_LABEL[meta.category]],
      ].filter(([, v]) => v),
    };
  });

export const isVideo = (src) => /\.mp4$/i.test(src ?? "");
