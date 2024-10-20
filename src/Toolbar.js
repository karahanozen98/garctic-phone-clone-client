import { MODEL_BUTTONS } from "./constants";
import { useIsMobile } from "./hooks";

export default function ToolBar({
  canvas,
  context,
  drawing,
  settings,
  history,
  redoHistory,
  drawCanvas,
  render,
}) {
  const isMobile = useIsMobile();
  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const undoCanvas = (e) => {
    prevent(e);
    if (history.current.length === 0) return;
    redoHistory.current.push(history.current.pop());
    drawCanvas(getContext());
    render();
  };

  const redoCanvas = (e) => {
    prevent(e);
    if (redoHistory.current.length === 0) return;
    history.current.push(redoHistory.current.pop());
    drawCanvas(getContext());
    render();
  };

  const exportCanvas = () => {
    const link = document.createElement("a");
    const content = JSON.stringify(history.current);
    const file = new Blob([content], { type: "application/json" });
    link.href = URL.createObjectURL(file);
    link.download = `canvas_export_${Date.now()}_${Math.floor(
      Math.random() * 3
    )}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getContext = (config, ctx) => {
    if (!context.current) {
      context.current = canvas.current.getContext("2d");
    }
    if (!ctx) ctx = context.current;
    if (config) {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.stroke;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    return ctx;
  };

  const setMode = (mode) => (e) => {
    settings.current.mode = mode;
    render();
  };

  return (
    <div style={{ background: "#332344", borderRadius: 10 }}>
      <div
        className="menu"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        aria-disabled={drawing}
        style={{
          display: "grid",
          gap: "10px",
          padding: 10,
          gridTemplateColumns: isMobile ? "auto auto auto" : "auto auto",
        }}
      >
        {MODEL_BUTTONS.map((btn) => (
          <button
            className="primary"
            key={btn.mode}
            type="button"
            onClick={setMode(btn.mode)}
            aria-pressed={settings.current.mode === btn.mode}
          >
            <img
              src={"/assets/" + btn.icon}
              alt={btn.title}
              title={btn.title}
            />
          </button>
        ))}
        <button
          className="primary"
          type="button"
          onClick={undoCanvas}
          disabled={history.current.length === 0}
        >
          <img src="/assets/undo.svg" alt="undo" title="undo" />
        </button>
        <button
          className="primary"
          type="button"
          onClick={redoCanvas}
          disabled={redoHistory.current.length === 0}
        >
          <img src="/assets/redo.svg" alt="redo" title="red" />
        </button>
        <div
          className="menu right"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          aria-disabled={drawing}
        >
          <button
            className="primary"
            type="button"
            onClick={exportCanvas}
            disabled={history.current.length === 0}
          >
            <img src="/assets/export.svg" alt="export" title="export" />
          </button>
        </div>
      </div>
    </div>
  );
}
