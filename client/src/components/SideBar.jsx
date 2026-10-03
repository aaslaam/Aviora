import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const SideBar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate()

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu_icon"
              className="max-h-5 cursor-pointer"
            />
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 px-4 py-3 mt-5">
          <img src={assets.search_icon} alt="search_icon" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-xs text-white placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>
    </div>
  )
}

export default SideBar