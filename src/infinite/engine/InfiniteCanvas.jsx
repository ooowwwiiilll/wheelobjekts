import * as React from "react";

// Lazy-load the heavy three.js scene so the rest of the page (header, loader,
// detail panel) can paint immediately and the WebGL bundle only loads here.
const LazyScene = React.lazy(() =>
  import("./scene.jsx").then((mod) => ({ default: mod.InfiniteCanvasScene }))
);

export function InfiniteCanvas(props) {
  return (
    <React.Suspense fallback={null}>
      <LazyScene {...props} />
    </React.Suspense>
  );
}
