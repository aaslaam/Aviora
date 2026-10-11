import React, { useContext } from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

const SideBar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
              <p onClick={handleLogout} className="cursor-pointer text-sm">
                Logout
              </p>
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

      {/* User list */}
      <div className="flex flex-col">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user)
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && 'bg-[#282142] '
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              className="w-[35px] aspect-square rounded-full"
              alt="ProfilePic"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {/* Online/Offline status */}
              {index > 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            <div>
              {/* Notification badge */}
              {index > 2 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {index}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar