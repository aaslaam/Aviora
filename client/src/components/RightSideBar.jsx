import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const RightSideBar = ({ selectedUser }) => {
  return selectedUser && (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-20 aspect-square rounded-full"
          alt="profilePic"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {selectedUser?.fullName}
        </h1>
        <p className="px-10 mx-auto text-center">{selectedUser?.bio}</p>
      </div>

      <hr className="border-stone-400 my-4" />
      {/* Media Section */}
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {imagesDummyData.map((url, index) => (
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
    </div>
  )
}

export default RightSideBar