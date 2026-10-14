import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import assets from "../assets/assets";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";

const RightSideBar = ({ showRightSideBar }) => {
  const navigate = useNavigate();
  const { selectedUsers: selectedUser, msgs } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);

  // all image urls from msgs
  const msgImages = useMemo(
    () => msgs.filter((msg) => msg.image).map((msg) => msg.image),
    [msgs],
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!selectedUser || !showRightSideBar) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-20 aspect-square rounded-full"
          alt="profilePic"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser?.fullName}
        </h1>
        <p className="px-10 mx-auto text-center">{selectedUser?.bio}</p>
      </div>

      <hr className="border-stone-400 my-4" />

      {/* Media Section */}
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              className="cursor-pointer rounded"
              onClick={() => window.open(url)}
            >
              <img src={url} className="h-full rounded-md" alt="" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2
        bg-linear-to-r from-purple-400 to-violet-600
        text-white border-none text-sm font-light
        py-2 px-20 rounded-full cursor-pointer"
      >
        LogOut
      </button>
    </div>
  );
};

export default RightSideBar;
