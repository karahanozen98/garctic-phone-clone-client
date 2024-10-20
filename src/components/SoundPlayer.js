import { forwardRef } from "react";

const SoundPlayer = forwardRef(function SoundPlayer({ src }, ref) {
  return (
    <audio ref={ref}>
      <source src={src} type="audio/mpeg" />
    </audio>
  );
});

export default SoundPlayer;
