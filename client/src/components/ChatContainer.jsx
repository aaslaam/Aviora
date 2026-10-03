import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { MsgTimeFormat } from "../lib/utils";

const currentUserId = '680f50e4f10f3cd28382ecf9'

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef(null)

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedUser])

  return selectedUser ? (
    <div className='w-full overflow-scroll relative backdrop-blur-lg'>
      {/* Chat Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-400'>
        <img src={assets.profile_martin} className="w-8 rounded-full" alt="ProfilePic" />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Monkey D Luffy
          {/* Online/Offline status */}
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt="arrow"
        />
        <img src={assets.help_icon} className="max-md:hidden max-w-5" alt="help" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== currentUserId ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                alt=""
              />
            ) : (
              <p
                className={`max-w-[200px] p-2 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === currentUserId ? 'rounded-br-none' : 'rounded-bl-none'
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
              <img
                src={msg.senderId === currentUserId ? assets.avatar_icon : assets.profile_martin}
                className="w-7 rounded-full"
                alt="ProfilePic"
              />
              <p className='text-gray-500'>{MsgTimeFormat(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      {/* Placeholder when no user is selected */}
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className='text-lg font-medium text-white'>Chat Anytime! Anywhere!</p>
    </div>
  )
}

export default ChatContainer