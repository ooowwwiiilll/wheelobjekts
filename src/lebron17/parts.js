// ─────────────────────────────────────────────────────────────────────────────
// /lebron17 — THE PART REGISTRY. One entry per component: what it is made of,
// where it flies to when the shoe explodes, where the camera goes when you dive
// into it, and the copy the sidebar reads out.
//
// `explode` is a direction × distance in world units, applied on top of the
// part's built position. `cam` is [camera, target]. `anchor` is where the
// callout dot sits when labels are on.
// ─────────────────────────────────────────────────────────────────────────────

export const SHOE = {
  name: "Nike LeBron 17",
  year: "2019",
  designer: "Jason Petrie",
  brief: "create force without fear",
  source: "https://www.youtube.com/watch?v=ZC7yGF6Wr_E",
  note:
    "LeBron's seventeenth signature shoe is the first to carry two different Air systems at once: a full-height Max Air unit in the heel — the largest ever put in a basketball shoe — and two maximum-volume Zoom Air pods under the forefoot. Every curve below is traced off Nike's official photography of the shoe, measured pixel by pixel rather than drawn by eye.",
};

export const PARTS = [
  {
    id: "upper",
    label: "Knitposite 2.0",
    tag: "upper",
    kind: "knit",
    explode: [0, 1.35, 0],
    anchor: [0.15, 0.95, -0.34],
    cam: [[1.95, 2.05, 2.85], [0.05, 0.95, 0]],
    facts: [["material", "engineered knit + heat-moulded yarn"], ["build", "one-piece bootie, no separate tongue"], ["zones", "soft over the flex, locked at the sides"]],
    copy:
      "a single knit skin with a second structure moulded straight into it. the yarns are heat-set so the sidewalls behave like Foamposite while the flex zones stay soft — one piece doing the job of an upper and a cage.",
  },
  {
    id: "cage",
    label: "moulded chevron ribs",
    tag: "structure",
    kind: "posite",
    explode: [0, 2.05, 0],
    anchor: [-0.62, 1.05, 0],
    cam: [[0.95, 2.55, 2.75], [-0.55, 1.00, 0]],
    facts: [["material", "heat-moulded yarn, raised"], ["heel", "five ribs, nested up the back"], ["forefoot", "quilted bands off the foxing"]],
    copy:
      "five ribs stack up the back of the heel and wrap round to both sides, with quilted bands over the forefoot. they are moulded into the knit rather than stitched on, which is what holds the shape of the collar when the foot loads sideways.",
  },
  {
    id: "collar",
    label: "collar + rear tab",
    tag: "fit",
    kind: "knit",
    explode: [0, 2.65, 0],
    anchor: [-0.72, 1.50, 0],
    cam: [[0.55, 3.05, 2.55], [-0.65, 1.45, 0]],
    facts: [["shape", "two points, notched between"], ["height", "1.72 at the front peak, 1.60 at the tab"], ["job", "lock the ankle with no strap"]],
    copy:
      "the topline is not a circle. it rises to a point above the ankle, drops into a notch, then rises again to the rear tab — the profile that makes the 17 recognisable from across a court.",
  },
  {
    id: "lacing",
    label: "lacing + moulded loops",
    tag: "closure",
    kind: "lace",
    explode: [0.20, 2.35, 0],
    anchor: [-0.22, 1.30, 0],
    cam: [[0.65, 2.95, 2.35], [-0.15, 1.25, 0]],
    facts: [["rows", "five loops each side"], ["eyelets", "moulded, not stitched webbing"], ["job", "pull the knit onto the foot"]],
    copy:
      "the eyelets are moulded loops standing off the throat, so pulling the laces tightens the knit structure itself. there is no tongue underneath — the bootie closes over the instep.",
  },
  {
    id: "heel",
    label: "TPU heel cradle",
    tag: "structure",
    kind: "tpu",
    explode: [-1.75, 0.55, 0],
    anchor: [-1.18, 0.55, -0.32],
    cam: [[-3.15, 1.55, 2.35], [-1.15, 0.50, 0]],
    facts: [["material", "translucent moulded TPU"], ["wrap", "round the bag, up both sides"], ["carries", "the swoosh"]],
    copy:
      "a smoked translucent cradle wraps the heel and cups the Air bag from both sides. it is the only thing standing between a 25 mm bladder and a rolled ankle, and it is where the swoosh sits.",
  },
  {
    id: "swoosh",
    label: "swoosh",
    tag: "branding",
    kind: "gloss",
    explode: [0, 1.05, -1.55],
    anchor: [-0.78, 0.52, -0.46],
    cam: [[-0.55, 1.35, -3.05], [-0.75, 0.50, -0.25]],
    facts: [["placement", "on the cradle, not the knit"], ["angle", "tail forward and low, tip back and high"]],
    copy:
      "placed on the translucent cradle over the heel, tail sweeping forward and down. on the knit it would disappear into the texture; on the smoked panel it reads from any angle.",
  },
  {
    id: "sockliner",
    label: "sockliner",
    tag: "underfoot",
    kind: "foam",
    explode: [0, 0.50, 0],
    anchor: [0.20, 0.36, 0],
    cam: [[1.55, 1.85, 2.45], [0.10, 0.34, 0]],
    facts: [["material", "moulded foam"], ["job", "step-in feel over the Air"]],
    copy:
      "the last soft layer before the foot. it smooths over the seam between the foam carrier and the two Air systems below, so the ride reads as one surface.",
  },
  {
    id: "midsole",
    label: "Cushlon carrier",
    tag: "midsole",
    kind: "foam",
    explode: [0, -0.30, 0],
    anchor: [0.62, 0.30, 0.42],
    cam: [[2.15, 1.15, 2.55], [0.30, 0.30, 0]],
    facts: [["material", "Cushlon foam"], ["thickness", "18 mm at the ball, gone at the heel"], ["shape", "cored out over every chamber"]],
    copy:
      "the foam is a chassis, not the cushioning. it is hollowed out to the shape of the heel bag and the two pods, which is why its underside is a wave — and why it disappears entirely behind the heel, where the bag reaches the ground.",
  },
  {
    id: "air720",
    label: "Max Air 720",
    tag: "cushioning",
    kind: "air",
    explode: [-1.35, -1.00, 0],
    anchor: [-1.05, 0.26, 0],
    cam: [[-2.85, 0.95, 2.45], [-1.00, 0.24, 0]],
    facts: [["volume", "largest heel Air unit on a LeBron"], ["height", "25 mm, ground to foam"], ["reach", "the rear 43% of the shoe"], ["job", "impact on landing"]],
    copy:
      "a full-height bag under the heel with no foam between it and the ground. it is the widest point of the whole shoe — the outsole and the cradle are the only things touching it — and it tapers out just past the arch.",
  },
  {
    id: "zoom",
    label: "dual Zoom Air pods",
    tag: "cushioning",
    kind: "air",
    explode: [1.30, -1.05, 0],
    anchor: [0.62, 0.12, -0.26],
    cam: [[2.05, 1.05, 2.55], [0.60, 0.10, 0]],
    deep: true,
    facts: [["units", "two, side by side"], ["placement", "one lateral, one medial"], ["height", "15 mm, maximum volume"], ["inside", "tensile fibres under pressure"]],
    copy:
      "two separate bags run down the forefoot, one under the lateral side and one under the medial, split by a channel so they compress independently on a cut. each is laced with tensile fibres: load it and they stretch, unload and they snap the faces back together.",
  },
  {
    id: "outsole",
    label: "rubber outsole",
    tag: "traction",
    kind: "rubber",
    explode: [0, -1.55, 0],
    anchor: [0.55, 0.06, 0.38],
    cam: [[1.75, -0.35, 2.85], [0.35, 0.06, 0]],
    facts: [["material", "solid rubber, wrapping the sidewall"], ["pattern", "feathered waves, full length"], ["marks", "Dunkman window under the forefoot"]],
    copy:
      "the only piece touching the floor, and it climbs the sidewall far enough to be a design line in its own right. the tread is a feathered wave rather than herringbone, and it splits between the two forefoot pods.",
  },
];

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p]));

// The default view, and where the camera parks itself when nothing is focused.
export const HOME = [[2.70, 1.50, 3.10], [0, 0.14, 0]];
