import React, { useState,useContext } from 'react'

import assets from '../assets/assets'
import { AuthContext } from "../../context/authContext";
const LoginPage = () => {
  const [curState, SetCurState] = useState('Sign Up')
  const [fullName, SetFullName] = useState('')
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [bio, SetBio] = useState('')
  const [isDataSubmitted, SetIsDataSubmitted] = useState(false)

    const {login} = useContext(AuthContext)
  

  const handleSubmit = (e) => {
    e.preventDefault()

    //  go to the bio step
    if (curState === 'Sign Up' && !isDataSubmitted) {
      SetIsDataSubmitted(true)
      return
    }
    login(curState  == 'Sign Up' ? "signup" : "login",{
      fullName,
      bio,
      email,
      password
    })
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left Side */}
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" alt="Logo" />

      {/* Right Side */}
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-600 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {curState}
          {isDataSubmitted && (
            <img
              onClick={() => SetIsDataSubmitted(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
              alt="arrow_icon"
            />
          )}
        </h2>

        {curState === 'Sign Up' && !isDataSubmitted && (
          <input
            onChange={(e) => SetFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => SetEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => SetPassword(e.target.value)}
              value={password}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}

        {curState === 'Sign Up' && isDataSubmitted && (
          <>
            <h2 className="text-lg text-gray-400">Tell us about yourself!</h2>
            <textarea
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about yourself..."
              onChange={(e) => SetBio(e.target.value)}
              value={bio}
            ></textarea>
          </>
        )}

        <button
          type="submit"
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {curState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {curState === 'Sign Up' && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" />
            <p>Agree To Privacy Policy and TOS</p>
          </div>
        )}

        {/* switch between login and sign up */}
        <div className="flex flex-col gap-2">
          {curState === 'Sign Up' ? (
            <p className="text-sm text-gray-600">
              Already Have An Account{' '}
              <span
                onClick={() => {
                  SetCurState('Login')
                  SetIsDataSubmitted(false)
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create An Account{' '}
              <span
                onClick={() => SetCurState('Sign Up')}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage