import React from "react";

// Keeps a thrown error in the WebGL scene from unmounting the whole page,
// and surfaces the message instead of a blank screen.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[infinite] caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <pre
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            margin: 0,
            padding: "2rem",
            overflow: "auto",
            background: "#161616",
            color: "#ff6a6a",
            font: "12px/1.5 monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {String(this.state.error?.stack || this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}
