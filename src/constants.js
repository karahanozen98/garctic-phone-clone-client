export const MODES = {
  PAN: 0,
  PEN: 1,
  LINE: 2,
  RECT: 3,
  CIRCLE: 4,
  ERASER: 5,
};

export const PAN_LIMIT = 1516;
export const CANVAS_HEIGHT = 848;
export const CANVAS_WIDTH = 1516;

export const MODEL_BUTTONS = [
  {
    mode: MODES.PEN,
    title: "Pen",
    icon: "pen.svg",
  },
  {
    mode: MODES.ERASER,
    title: "Eraser",
    icon: "eraser.svg",
  },
  {
    mode: MODES.PAN,
    title: "move",
    icon: "move.svg",
  },
  {
    mode: MODES.RECT,
    title: "rectangle",
    icon: "rectangle.svg",
  },
  {
    mode: MODES.CIRCLE,
    title: "circle",
    icon: "circle.svg",
  },
];
