import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState('Jhon Doe')
  const [bio, setBio] = useState('Tell us about yourself..')
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-300 flex items-center justify-center max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>

          {/* Profile Picture Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
              className={`w-12 h-12 object-cover ${selectedImage ? 'rounded-full' : ''}`}
              alt="ProfilePic"
            />
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              className="hidden"
              accept=".jpg,.jpeg,.png"
            />
            Upload Profile Picture
          </label>

          {/* Name Input */}
          <input
            onChange={(e) => setName(e.target.value)}
            required
            value={name}
            type="text"
            placeholder="Your Name.."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio Input */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
            rows={4}
            placeholder="Tell us about yourself.."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>
          <button type="submit" className='bg-linear-to-r from-purple-400 to-purple-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save Changes</button>
        </form>
        <img src={assets.logo_icon} className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" alt="logo" />
      </div>
    </div>
  )
}

export default ProfilePage