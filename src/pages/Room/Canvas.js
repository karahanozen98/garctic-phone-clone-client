import { useEffect, useReducer, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODES, PAN_LIMIT } from "../../constants";
import ColorPalette from "./ColorPalette";
import CanvasToolbar from "./CanvasToolbar";
import { DrawGuessInput } from "./DrawGuessInput";
import { BottomBar } from "./BottomBar";
import { useIsMobile } from "../../hooks";
import CanvasHeader from "./CanvasHeader";
import CanvasLeftMenu from "./CanvasLeftMenu";

let lastPath = [];

const Canvas = ({
  settings,
  scale = 1,
  content,
  readonly,
  hideHeader,
  hideLeftMenu,
  hideToolbar,
  hideColorPalette,
  showGuessInput,
}) => {
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
  const isMobile = useIsMobile();
  useEffect(() => {
    if (content) {
      const ctx = getContext();
      clearCanvas(ctx);
      history.current = content;
      for (const item of history.current) {
        getContext(item, ctx);
        drawModes(item.mode, ctx, null, item.path, item.scaleRatio, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

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
    drawModes(
      settings.current.mode,
      context.current,
      point,
      lastPath,
      calcScaleRatio()
    );
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
        scaleRatio: calcScaleRatio(),
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
    drawModes(
      settings.current.mode,
      context.current,
      point,
      lastPath,
      calcScaleRatio()
    );
  };

  const drawModes = (
    mode,
    ctx,
    point,
    path,
    scaleRatio = 1,
    initialDraw = false
  ) => {
    if (readonly && !initialDraw) {
      return;
    }

    switch (mode) {
      case MODES.PEN:
        point
          ? previewPen(point, scaleRatio, ctx)
          : drawPen(path, scaleRatio, ctx);
        break;
      case MODES.RECT:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewRect(path, scaleRatio, ctx);
        } else {
          drawRect(path, scaleRatio, ctx);
        }
        break;
      case MODES.CIRCLE:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewCircle(path, scaleRatio, ctx);
        } else {
          drawCircle(path, scaleRatio, ctx);
        }
        break;
      case MODES.ERASER:
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 30;
        point
          ? previewPen(point, scaleRatio, ctx)
          : drawPen(path, scaleRatio, ctx);
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

  const previewRect = (path, scaleRatio, ctx) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    drawRect(path, scaleRatio, getContext(settings.current, ctx));
  };

  const drawRect = (path, scaleRatio, ctx) => {
    if (!isValidPath(path)) return;
    ctx.beginPath();
    ctx.rect(
      path[0][0] * scaleRatio,
      path[0][1] * scaleRatio,
      path[1][0] - path[0][0],
      path[1][1] - path[0][1]
    );
    ctx.stroke();
  };

  const previewCircle = (path, scaleRatio, ctx) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    getContext(settings.current, ctx); // reset context
    drawCircle(path, scaleRatio, ctx);
  };

  const getDistance = ([[p1X, p1Y], [p2X, p2Y]]) => {
    return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
  };

  const drawCircle = (path, scaleRatio, ctx) => {
    if (!isValidPath(path)) return;
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

  const previewPen = (point, scaleRatio, ctx) => {
    if (lastPath.length === 0) {
      ctx.beginPath();
      ctx.moveTo(point[0] * scaleRatio, point[1] * scaleRatio);
    }
    ctx.lineTo(point[0] * scaleRatio, point[1] * scaleRatio);
    ctx.stroke();
    lastPath.push(point);
  };

  const drawPen = (points, scaleRatio, ctx) => {
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
      drawModes(item.mode, ctx, null, item.path, item.scaleRatio);
    }
  };

  const calcScaleRatio = () => 1 / scale;

  const isValidPath = (path) => {
    return (
      Array.isArray(path) &&
      Array.isArray(path.at(0)) &&
      path[0].length === 2 &&
      Array.isArray(path.at(1)) &&
      path[1].length === 2
    );
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointermove", onPointerMove);
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
        {!hideLeftMenu && <CanvasLeftMenu settings={settings} />}
        <div
          style={{
            background: "#332344",
            border: "10px solid #332344",
            borderRadius: 15,
            maxWidth: CANVAS_WIDTH + 10,
            width: "100%",
            minWidth: 500,
            flex: "1 1 200px",
          }}
        >
          <div
            className="custom-scroll"
            style={{
              overflow: "auto",
            }}
          >
            {!hideHeader && <CanvasHeader />}
            <canvas
              ref={canvas}
              style={{ backgroundColor: "#fff", touchAction: "none" }}
              width={width}
              height={height}
              onPointerDown={onPointerDown}
              className={
                settings.current.mode === MODES.PAN ? "moving" : "drawing"
              }
            />
          </div>
          {showGuessInput && <DrawGuessInput />}
          {!readonly && <BottomBar settings={settings} history={history} />}
        </div>

        {!hideColorPalette && isMobile && (
          <ColorPalette
            value={settings.current.color}
            onSelectColor={(color) => (settings.current.color = color)}
          />
        )}
        {!hideToolbar && (
          <CanvasToolbar
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
    </div>
  );
};

export default Canvas;
