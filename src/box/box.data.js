// ─────────────────────────────────────────────────────────────────────────────
// /box — CONTENT. Self-contained: the route is a shop prototype, so it carries
// its own catalogue rather than reading content/items.js.
//
//   slug     the URL segment, /box/<slug>
//   shots    product images, square-cropped in the grid, stacked down the PDP
//   facts    the two accordion panels on the PDP
// ─────────────────────────────────────────────────────────────────────────────

const source = [
  {
    slug: "color-index",
    title: '"COLOR INDEX" — JULIA SCHIMAUTZ (SECOND EDITION)',
    price: 35,
    shots: ["/szbloom_compressed.jpeg", "/ssamo_dgrid_compressed.png"],
    blurb: [
      "A gradient index printed edge to edge, so the deck reads as one continuous field when it is fanned out and as fifty-two separate plates when it is not.",
      "The second edition corrects the registration on the court cards and swaps the tuck box stock for an uncoated board.",
      "Made in very limited numbers.",
    ],
    artist: "Julia Schimautz is a graphic designer working between Vienna and Copenhagen, mostly on print, colour systems and identity work for cultural clients.",
    details: "54 cards, 310gsm blue-core stock, uncoated tuck box, foil-stamped seal. Printed in Denmark. Edition of 500.",
  },
  {
    slug: "iwannabangkok-red",
    title: "IWANNABANGKOK© — RED",
    price: 50,
    shots: ["/skfc.gif", "/smtb_compressed.png"],
    blurb: [
      "Spend a few days in Bangkok and you start spotting the bold red letters around town. The mark began in 2014, when two local fashion graduates turned a party joke into an I-heart-NY logo for their own city.",
      "For this collaboration we took a cue from the classic hand fan. Spread the cards and the logo unfolds.",
      "Made in very limited numbers.",
    ],
    artist: "IWANNABANGKOK© is a street label from Bangkok, founded 2014, best known for its wordmark and its collaborations with local printers.",
    details: "54 cards, 310gsm blue-core stock, red foil tuck box. Printed in Thailand. Edition of 300.",
  },
  {
    slug: "iwannabangkok-grey",
    title: "IWANNABANGKOK© — GREY",
    price: 50,
    shots: ["/sthuy_compressed.png", "/ssamo_compressed.png"],
    blurb: [
      "The same fan, pulled down to a single grey. The logo only resolves at a distance, which is the point.",
      "Made in very limited numbers.",
    ],
    artist: "IWANNABANGKOK© is a street label from Bangkok, founded 2014, best known for its wordmark and its collaborations with local printers.",
    details: "54 cards, 310gsm blue-core stock, grey board tuck box. Printed in Thailand. Edition of 300.",
  },
  {
    slug: "iwannabangkok-green",
    title: "IWANNABANGKOK© — GREEN",
    price: 50,
    shots: ["/szted_compressed.png", "/ssamo_dtiles_compressed.mp4"],
    blurb: [
      "A fluorescent run, mixed to sit one step past what the press sheet is supposed to hold.",
      "Made in very limited numbers.",
    ],
    artist: "IWANNABANGKOK© is a street label from Bangkok, founded 2014, best known for its wordmark and its collaborations with local printers.",
    details: "54 cards, 310gsm blue-core stock, fluorescent tuck box. Printed in Thailand. Edition of 300.",
  },
  {
    slug: "eat-extra",
    title: '"EAT EXTRA, EAT IT UP!" — LULU LIN',
    price: 40,
    shots: ["/skix_compressed.png", "/mokuri1_compressed.jpeg"],
    blurb: [
      "Fifty-two plates of food, one per card, arranged so a full suit builds a meal and a full deck builds a week of them.",
      "Made in very limited numbers.",
    ],
    artist: "Lulu Lin is an illustrator working in Taipei, mostly on food, packaging and editorial commissions.",
    details: "54 cards, 310gsm blue-core stock, uncoated tuck box. Printed in Taiwan. Edition of 400.",
  },
  {
    slug: "paku-paku",
    title: '"PAKU PAKU" — EMA GASPAR',
    price: 40,
    shots: ["/xokuri_compressed.png", "/mokuri2_compressed.jpeg"],
    blurb: [
      "A chewing, swallowing, endlessly hungry set of pips. The suits eat each other in rank order.",
      "Made in very limited numbers.",
    ],
    artist: "Ema Gaspar is a Lisbon-based illustrator and animator.",
    details: "54 cards, 310gsm blue-core stock, matte tuck box. Printed in Portugal. Edition of 400.",
  },
  {
    slug: "think-big",
    title: '"THINK BIG" — JULIEN JACA',
    price: 40,
    shots: ["/sfast.png", "/ssamo_dsimulator_compressed.png"],
    blurb: [
      "Numerals blown up until they crop themselves against the card edge. Legible at a table, illegible in the hand.",
      "Made in very limited numbers.",
    ],
    artist: "Julien Jaca is a type designer and poster artist based in Marseille.",
    details: "54 cards, 310gsm blue-core stock, black board tuck box. Printed in France. Edition of 350.",
  },
  {
    slug: "little-friends",
    title: '"SAY HELLO TO MY LITTLE FRIENDS" — AARON JOHNSON',
    price: 40,
    shots: ["/sgop.png", "/saxis.png"],
    blurb: [
      "Every court card is a portrait, and every portrait is looking straight back at whoever is holding the hand.",
      "Made in very limited numbers.",
    ],
    artist: "Aaron Johnson is a painter working in New York.",
    details: "54 cards, 310gsm blue-core stock, uncoated tuck box. Printed in the USA. Edition of 300.",
  },
  {
    slug: "deck-of-cards",
    title: '"DECK OF CARDS FOR PLAYING CARD GAMES ETC..." — RYAN TRAVIS CHRISTIAN',
    price: 40,
    shots: ["/szkutt.png", "/wob.gif"],
    blurb: [
      "Graphite-grey rubber-hose drawing across all fifty-two, titled exactly as literally as it behaves.",
      "Made in very limited numbers.",
    ],
    artist: "Ryan Travis Christian is an artist based in Illinois, working mainly in graphite.",
    details: "54 cards, 310gsm blue-core stock, grey board tuck box. Printed in the USA. Edition of 250.",
  },
];

export const products = source.map((p) => ({
  ...p,
  hero: p.shots[0],
  priceLabel: `€${p.price},00`,
}));

export const bySlug = (slug) => products.find((p) => p.slug === slug) ?? null;

export const isVideo = (src) => /\.mp4$/i.test(src ?? "");
