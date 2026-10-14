import React, { useContext, useState } from "react";

import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { ChatContext } from "../../context/chatContext";

const Homepage = () => {
  const { selectedUsers } = useContext(ChatContext);
  const [showRightSideBar, setShowRightSideBar] = useState(true);

  const gridCols = !selectedUsers
    ? "md:grid-cols-2"
    : showRightSideBar
      ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
      : "md:grid-cols-[1fr_2fr]";

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${gridCols}`}
      >
        <SideBar />
        <ChatContainer
          showRightSideBar={showRightSideBar}
          setShowRightSideBar={setShowRightSideBar}
        />
        <RightSideBar showRightSideBar={showRightSideBar} />
      </div>
    </div>
  );
};

export default Homepage;
