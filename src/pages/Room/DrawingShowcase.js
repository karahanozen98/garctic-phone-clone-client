import { useEffect, useRef } from "react";
import Canvas from "./Canvas";
import { ENTRY_TYPE, MODES } from "../../constants";
import { socket } from "../../socket";
import { useRoomStore } from "../../store/roomStore";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { useAuthSore } from "../../store/authStore";

export function DrawingShowcase() {
  const showcaseUpdate = "showcase-update";
  const { id } = useParams();
  const room = useRoomStore((state) => state.room);
  const user = useAuthSore((state) => state.user);
  const showcase = useRoomStore((state) => state.showcase);
  const setShowcase = useRoomStore((state) => state.setShowcase);
  const getShowcase = useRoomStore((state) => state.getShowcase);
  const moveToNextShowcase = useRoomStore((state) => state.moveToNextShowcase);

  const settings = useRef({
    stroke: 5,
    color: "#000000",
    mode: MODES.PEN,
  });

  useEffect(() => {
    getShowcase(id);
    socket.on(showcaseUpdate, ({ showcase }) => {
      setShowcase(showcase);
    });
    return () => {
      socket.off(showcaseUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMoveNext = (e) => {
    e.preventDefault();
    moveToNextShowcase(id);
  };

  return (
    <div
      style={{
        borderRadius: 10,
        padding: 10,
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        height: "100vh",
        gap: 20,
      }}
    >
      {showcase.map((item, index) => (
        <>
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "600px",
              maxHeight: 400,
            }}
          >
            <div>
              {item.type === ENTRY_TYPE.Sentence ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MessageItem
                    message={item.content}
                    sender={
                      <ProfileCard
                        player={item.owner}
                        avatarSize={40}
                        gap={5}
                      />
                    }
                  />
                </div>
              ) : (
                <div>
                  <ProfileCard player={item.owner} avatarSize={50} />
                  <div
                    style={{
                      top: "0%",
                      transform: "translate(-30%, -80%)",
                      width: "max-content",
                      height: "400px",
                    }}
                  >
                    <Canvas
                      settings={settings}
                      scale={0.3}
                      content={item.content}
                      readonly
                      hideHeader
                      hideLeftMenu
                      hideToolbar
                      hideColorPalette
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {index < showcase?.length - 1 && (
            <i
              className="fa-solid fa-arrow-down fa-2xl"
              style={{ color: "#fff" }}
            ></i>
          )}
        </>
      ))}
      {user.id === room.owner.id && (
        <button
          className="primary"
          style={{ width: "min-content" }}
          onClick={handleMoveNext}
        >
          Next
        </button>
      )}
    </div>
  );
}

const MessageItem = ({ message, sender }) => {
  // Styles for the message container
  const messageStyle = {
    display: "flex",
    flexDirection: sender === "user" ? "row-reverse" : "row",
    padding: "10px",
    margin: "5px 0",
    alignItems: "center",
  };

  // Styles for the text bubble
  const bubbleStyle = {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "20px",
    backgroundColor: sender === "user" ? "#4CAF50" : "#e0e0e0",
    color: sender === "user" ? "#fff" : "#000",
    fontSize: "14px",
    wordWrap: "break-word",
  };

  // Optionally, you can add some styles for the sender's name if you'd like
  const senderStyle = {
    fontSize: "12px",
    color: sender === "user" ? "#fff" : "#000",
    marginBottom: "5px",
  };

  return (
    <div style={messageStyle}>
      {/* Optionally display sender's name */}
      {sender !== "user" && <div style={senderStyle}>{sender}</div>}
      <div style={bubbleStyle}>{message}</div>
    </div>
  );
};
