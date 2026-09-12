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
    label: "KFC",
    color: "#BE2A2A",
    subtitle: "nothing beats the original",
    discipline: "design system • digital channel rebrand",
    blurb: "a global multi-brand design system overhaul under Yum! brands.",
    hero: "/skfc.gif",
    body: [],
  },
  {
    id: "6",
    label: "Okuri",
    subtitle: "overengineered himekuri calendar",
    discipline: "visual arts • utility",
    blurb:
      "a digital tear-off calendar inspired by the traditional japanese himekuri, with an over-engineered contemporary spin. swipe to flip a new sheet each day.",
    hero: "/xokuri_compressed.png",
    body: ["/mokuri1_compressed.jpeg", "/mokuri2_compressed.jpeg"],
  },
  {
    id: "10",
    label: "Blooms The Chemist",
    color: "#B5B5B5",
    lead: "Blooms",
    subtitle: "",
    discipline: "web development",
    blurb:
      "an australian retail pharmacy group and certified B Corp, offering health & wellness prescriptions, pharmacist consultations and medication ordering.",
    hero: "/szbloom_compressed.jpeg",
    body: [],
  },
  {
    id: "9",
    label: "Samosynth",
    color: "#3A2B2B",
    subtitle: "",
    discipline: "music development app",
    blurb:
      "a mini mpc / sampler celebrating bataknese culture, mixing hip-hop drum samples with processed taganing, kulcapi and gordang one-shots.",
    hero: "/ssamo_compressed.png",
    body: ["/ssamo_dsimulator_compressed.png", "/ssamo_dgrid_compressed.png"],
  },
  {
    id: "12",
    label: "Telkomsel Enterprise",
    lead: "Telkomsel",
    subtitle: "ted",
    discipline: "product design",
    blurb:
      "the B2B unit of telkomsel providing digital solutions and connectivity for corporations — network services, collaboration tools, IoT and CX insights.",
    hero: "/szted_compressed.png",
    body: [],
  },
  {
    id: "8",
    label: "Thanh Uy Art & Coffee",
    color: "#8C8C8C",
    lead: "Thanh Uy",
    subtitle: "art gallery & coffee",
    discipline: "visual arts",
    blurb:
      "an edgy printmaking gallery, studio and coffee shop in ha noi, celebrating vietnam's propaganda and renewal period through traditional & contemporary paintings.",
    hero: "/sthuy_compressed.png",
    body: [],
  },
  {
    id: "5",
    label: "MyTelkomsel Basic",
    color: "#3D5A27",
    lead: "MyTelkomsel",
    subtitle: "",
    discipline: "product design",
    blurb:
      "a lightweight telkomsel app for users with limited memory or unstable connections — balance monitoring, package shop and payments.",
    hero: "/smtb_compressed.png",
    body: [],
  },
  {
    id: "4",
    label: "KIX",
    subtitle: "interactive hoop shoes finder",
    discipline: "interactive 3D app",
    blurb: "a swift playground built for wwdc, featured on wwdc scholars.",
    hero: "/skix_compressed.png",
    body: [],
  },
  {
    id: "2",
    label: "Vietinbank",
    color: "#1B6BA5",
    subtitle: "efast",
    discipline: "product design",
    blurb: "corporate digital banking for one of vietnam's big four.",
    hero: "/sfast.png",
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
