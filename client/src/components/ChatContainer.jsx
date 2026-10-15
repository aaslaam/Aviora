import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import assets from "../assets/assets";
import { MsgTimeFormat } from "../lib/utils";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import VoiceMessage from "./VoiceMessage";

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const formatTimer = (s) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const ChatContainer = ({ showRightSideBar, setShowRightSideBar }) => {
  const {
    msgs,
    selectedUsers: selectedUser,
    SetSelectedUsers: setSelectedUser,
    sendMsgs,
    getMsgs,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);

  const [input, setInput] = useState("");

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMsgs({ text: input.trim() });
    setInput("");
  };

  const handleSendImg = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please Select An Image File");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMsgs({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceComplete = async ({ blob, duration }) => {
    try {
      const audio = await blobToDataURL(blob);
      await sendMsgs({ audio, audioDuration: duration });
    } catch (err) {
      toast.error("Failed to send voice message");
    }
  };

  const {
    isRecording,
    seconds,
    start: startRecording,
    stop: stopRecording,
    cancel: cancelRecording,
  } = useVoiceRecorder(handleVoiceComplete);

  // Discard an in-progress recording when switching chats
  useEffect(() => {
    if (selectedUser) {
      getMsgs(selectedUser._id);
    }
    return () => {
      cancelRecording();
    };
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && msgs) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  return selectedUser ? (
    <div className="w-full overflow-scroll relative backdrop-blur-lg">
      {/* Chat Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-400">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
          alt="ProfilePic"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {/* Online status */}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        {/* Mobile: back to user list */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt="arrow"
        />
        {/* Desktop: toggle right sidebar */}
        <img
          onClick={() => setShowRightSideBar((prev) => !prev)}
          src={assets.help_icon}
          className="max-md:hidden max-w-5 cursor-pointer"
          alt="help"
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {msgs.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {msg.audio ? (
              <VoiceMessage
                src={msg.audio}
                duration={msg.audioDuration}
                isOwn={msg.senderId === authUser._id}
              />
            ) : msg.image ? (
              <img
                src={msg.image}
                className="max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8"
                alt=""
              />
            ) : (
              <p
                className={`max-w-50 p-2 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                className="w-7 rounded-full"
                alt="ProfilePic"
              />
              <p className="text-gray-500">{MsgTimeFormat(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Chat Input Area */}
      <div className="absolute right-0 bottom-0 left-0 flex items-center gap-3 p-3">
        {isRecording ? (
          /* Recording UI */
          <div className="flex flex-1 items-center gap-3 bg-gray-100/12 px-3 py-3 rounded-full">
            <button
              type="button"
              onClick={cancelRecording}
              className="cursor-pointer"
              aria-label="Cancel recording"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-gray-300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
              </svg>
            </button>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="flex-1 text-sm text-white">
              Recording... {formatTimer(seconds)}
            </span>
          </div>
        ) : (
          <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMsg(e);
              }}
              type="text"
              placeholder="send a message..."
              className="flex-1 text-white placeholder-gray-600 text-sm p-3 border-none rounded-large outline-none"
            />
            <input
              onChange={handleSendImg}
              type="file"
              accept="image/jpeg,image/png"
              id="image"
              hidden
            />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                className="w-5 mr-2 cursor-pointer"
                alt="gallery_icon"
              />
            </label>
          </div>
        )}

        {isRecording ? (
          /* Stop and send the recording */
          <img
            onClick={stopRecording}
            src={assets.send_button}
            className="w-7 cursor-pointer"
            alt="send_voice_message"
          />
        ) : input.trim() === "" ? (
          /* Empty input: show the mic */
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-500 cursor-pointer"
            aria-label="Record voice message"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
            </svg>
          </button>
        ) : (
          <img
            onClick={handleSendMsg}
            src={assets.send_button}
            className="w-7 cursor-pointer"
            alt="send_button"
          />
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      {/* Placeholder when no user is selected */}
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat Anytime! Anywhere!</p>
    </div>
  );
};
export default ChatContainer;
