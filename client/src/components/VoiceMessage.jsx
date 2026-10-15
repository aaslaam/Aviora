import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const formatTime = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const VoiceMessage = ({ src, duration = 0, isOwn }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => toast.error("Couldn't play voice message"));
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrent(time);
  };

  return (
    <div
      className={`flex items-center gap-2 w-56 p-2 mb-8 rounded-lg bg-violet-500/30 text-white ${
        isOwn ? "rounded-br-none" : "rounded-bl-none"
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
      />

      <button
        type="button"
        onClick={toggle}
        className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-violet-500 cursor-pointer"
        aria-label={playing ? "Pause voice message" : "Play voice message"}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col flex-1 gap-1">
        {/* Uses the stored duration, because recorded webm blobs often
            report Infinity for audio.duration */}
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={Math.min(current, duration || 1)}
          onChange={handleSeek}
          className="w-full h-1 accent-violet-300 cursor-pointer"
        />
        <span className="text-[10px] text-gray-300">
          {formatTime(playing || current > 0 ? current : duration)}
        </span>
      </div>
    </div>
  );
};

export default VoiceMessage;
