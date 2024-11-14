import ColorPalette from "./ColorPalette";
import { useIsMobile } from "../../hooks";
import CanvasPlayerList from "./CanvasPlayerList";

export default function CanvasLeftMenu({ settings }) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        alignContent: "center",
        background: "#332344",
        borderRadius: 15,
        padding: 20,
      }}
    >
      <CanvasPlayerList />
      {!isMobile && (
        <ColorPalette
          value={settings.current.color}
          onSelectColor={(color) => (settings.current.color = color)}
        />
      )}
    </div>
  );
}
