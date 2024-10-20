import { useEffect, useReducer, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODES, PAN_LIMIT } from "./constants";
import ColorPalette from "./ColorPalette";
import ToolBar from "./Toolbar";
import { useRoomStore } from "./store/roomStore";
import { DrawGuessInput } from "./pages/Room/DrawGuessInput";
import { BottomBar } from "./pages/Room/BottomBar";
import { useIsMobile } from "./hooks";

let lastPath = [];

const Canvas = ({ settings, scale, readonly, ...rest }) => {
  const width = Math.min(CANVAS_WIDTH, PAN_LIMIT);
  const height = Math.min(CANVAS_HEIGHT, PAN_LIMIT);
  const [drawing, setDrawing] = useState(false);
  const [, render] = useReducer((prev) => !prev, false);
  const canvas = useRef(null);
  const context = useRef(null);
  const preview = useRef(null);
  const draw = useRef(false);
  const coords = useRef([0, 0]);
  const history = useRef([]);
  const redoHistory = useRef([]);
  const moving = useRef(false);
  const scaleRatio = 1 / scale;
  const quest = useRoomStore((state) => state.quest);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = getContext();
    clearCanvas(ctx);
    history.current = [];

    if (quest && quest?.type === 1) {
      history.current = quest.content;
      clearCanvas(ctx);
      for (const item of history.current) {
        getContext(item, ctx);
        drawModes(item.mode, ctx, null, item.path, true);
      }
      render();
    }
  }, [quest]);

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerDown = (e) => {
    prevent(e);
    getContext(settings.current);
    coords.current = [e.clientX, e.clientY];
    if (settings.current.mode === MODES.PAN) {
      moving.current = true;
      return;
    }
    setDrawing(true);
    draw.current = true;
    const point = getPoints(e, context.current);
    lastPath = [];
    drawModes(settings.current.mode, context.current, point, lastPath);
  };

  const onPointerUp = (e) => {
    prevent(e);
    if (settings.current.mode === MODES.PAN) {
      moving.current = false;
      return;
    }
    setDrawing(false);
    draw.current = false;
    if (lastPath.length > 0) {
      history.current.push({
        ...settings.current,
        path: lastPath,
      });
      redoHistory.current = [];
      lastPath = [];
      drawCanvas(getContext());
    }
  };

  const getPreviewActiveStyles = () => {
    const styles = {
      width: (width * 100) / PAN_LIMIT + "%",
      height: (height * 100) / PAN_LIMIT + "%",
    };
    if (!context.current) return styles;
    const { e, f } = getContext().getTransform();
    styles.left = (100 - e * 100) / PAN_LIMIT + "%";
    styles.top = (100 - f * 100) / PAN_LIMIT + "%";
    return styles;
  };

  const updatePreview = () => {
    if (preview.current) {
      const style = getPreviewActiveStyles();
      preview.current.style.left = style.left;
      preview.current.style.top = style.top;
    }
  };

  const onCanvasMove = (e, ctx) => {
    const [x1, y1] = coords.current;
    const { clientX: x2, clientY: y2 } = e;
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const { e: tdx, f: tdy } = ctx.getTransform();
    const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx), 0);
    const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy), 0);
    ctx.setTransform(1, 0, 0, 1, ntdx, ntdy);
    drawCanvas(ctx);
    coords.current = [x2, y2];
    updatePreview();
  };

  const onPointerMove = (e) => {
    prevent(e);
    if (moving.current) return onCanvasMove(e, context.current);
    if (!draw.current) return;
    const point = getPoints(e, context.current);
    drawModes(settings.current.mode, context.current, point, lastPath);
  };

  const drawModes = (mode, ctx, point, path, initialDraw = false) => {
    if (readonly && !initialDraw) {
      return;
    }

    switch (mode) {
      case MODES.PEN:
        point ? previewPen(point, ctx) : drawPen(path, ctx);
        break;
      case MODES.RECT:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewRect(path, ctx);
        } else {
          drawRect(path, ctx);
        }
        break;
      case MODES.CIRCLE:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewCircle(path, ctx);
        } else {
          drawCircle(path, ctx);
        }
        break;
      case MODES.ERASER:
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 30;
        point ? previewPen(point, ctx) : drawPen(path, ctx);
        break;
      default:
        return;
    }
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

  const getPoints = (e, ctx) => {
    const { e: dx, f: dy } = ctx.getTransform();
    const rect = canvas.current.getBoundingClientRect();
    return [e.clientX - rect.x - dx, e.clientY - rect.y - dy];
  };

  const previewRect = (path, ctx) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    drawRect(path, getContext(settings.current, ctx));
  };

  const drawRect = (path, ctx) => {
    ctx.beginPath();
    ctx.rect(
      path[0][0] * scaleRatio,
      path[0][1] * scaleRatio,
      path[1][0] - path[0][0],
      path[1][1] - path[0][1]
    );
    ctx.stroke();
  };

  const previewCircle = (path, ctx) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    getContext(settings.current, ctx); // reset context
    drawCircle(path, ctx);
  };

  const getDistance = ([[p1X, p1Y], [p2X, p2Y]]) => {
    return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
  };

  const drawCircle = (path, ctx) => {
    ctx.beginPath();
    ctx.arc(
      path[0][0] * scaleRatio,
      path[0][1] * scaleRatio,
      getDistance(path),
      0,
      2 * Math.PI
    );
    ctx.stroke();
  };

  const previewPen = (point, ctx) => {
    if (lastPath.length === 0) {
      ctx.beginPath();
      ctx.moveTo(point[0] * scaleRatio, point[1] * scaleRatio);
    }
    ctx.lineTo(point[0] * scaleRatio, point[1] * scaleRatio);
    ctx.stroke();
    lastPath.push(point);
  };

  const drawPen = (points, ctx) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0] * scaleRatio, points[0][1] * scaleRatio);
    for (const p of points) {
      ctx.lineTo(p[0] * scaleRatio, p[1] * scaleRatio);
    }
    ctx.stroke();
  };

  const clearCanvas = (ctx) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, PAN_LIMIT, PAN_LIMIT);
    ctx.restore();
  };

  const drawCanvas = (ctx) => {
    clearCanvas(ctx);
    for (const item of history.current) {
      getContext(item, ctx);
      drawModes(item.mode, ctx, null, item.path);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointermove", onPointerMove);
    // getContext().setTransform(
    //   1,
    //   0,
    //   0,
    //   1,
    //   -(PAN_LIMIT - width) / 2,
    //   -(PAN_LIMIT - height) / 2
    // );
    drawCanvas(getContext());
    updatePreview();
    return () => {
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onPointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div
      className="canvas-container"
      style={{
        margin: "auto",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: 10,
        }}
      >
        {quest.type === 0 && !isMobile && (
          <ColorPalette
            value={settings.current.color}
            onSelectColor={(color) => (settings.current.color = color)}
          />
        )}
        <div
          className="custom-scroll"
          style={{
            overflow: "auto",
            background: "#332344",
            border: "10px solid #332344",
            borderRadius: 15,
          }}
        >
          {quest?.type === 0 ? (
            <div style={{ color: "white", fontWeight: "bold", padding: 10 }}>
              <h2 style={{ color: "#40E0D0" }}>HEY IT'S TIME TO DRAW!</h2>
              <h1>{quest?.content?.toUpperCase()}</h1>
            </div>
          ) : (
            <div style={{ color: "white", fontWeight: "bold", padding: 10 }}>
              <h2 style={{ color: "#40E0D0" }}>
                HEY IT'S TIME TO GUESS THE DRAWING!
              </h2>
            </div>
          )}
          <canvas
            ref={canvas}
            style={{
              border: "1px solid black",
              backgroundColor: "white",
              touchAction: "none",
            }}
            width={width}
            height={height}
            onPointerDown={onPointerDown}
            className={
              settings.current.mode === MODES.PAN ? "moving" : "drawing"
            }
          />
        </div>
        {quest.type === 0 && isMobile && (
          <ColorPalette
            value={settings.current.color}
            onSelectColor={(color) => (settings.current.color = color)}
          />
        )}
        {quest.type === 0 && (
          <ToolBar
            canvas={canvas}
            context={context}
            drawing={drawing}
            settings={settings}
            history={history}
            redoHistory={redoHistory}
            render={render}
            drawCanvas={drawCanvas}
          />
        )}
      </div>
      {!readonly && <BottomBar settings={settings} history={history} />}
      {readonly && <DrawGuessInput />}
    </div>
  );
};

export default Canvas;
