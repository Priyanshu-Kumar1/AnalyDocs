'use client'

import Image from 'next/image'
import { useState } from 'react'

import './auth.css'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="flex flex-col justify-center px-16 bg-white w-1/2 border-r border-gray-200">
        <Image src="/assets/logo-light.svg" width={120} height={40} alt="Logo" className="mb-2" />
        <p className="mx-2 mt-2 text-gray-500">Smart documents made easy. Login or sign up to continue.</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center px-16 bg-gray-50 w-1/2">
        {/* Toggle */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-2 rounded ${mode === 'login' ? 'bg-blue text-white' : 'bg-blue-100 text-blue'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded ${mode === 'signup' ? 'bg-blue text-white' : 'bg-blue-100 text-blue'}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {mode === 'login' ? (
          <form className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back 👋</h2>
            <input
              type="text"
              placeholder="Username"
              name='username'
              className="p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name='password'
              className="p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue text-white py-3 rounded hover:bg-blue-700 font-semibold">
              Login
            </button>
          </form>
        ) : (
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Create Your Account</h2>
            <input
              type="text"
              placeholder="username"
              name='username'
              className="input-text-color-default p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name='email'
              className="p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              name='password'
              className="p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue text-white py-3 rounded hover:bg-blue-700 font-semibold">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
