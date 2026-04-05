import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const [id, setId] = useState('')
  const [name , setName]= useState('')
  const navigate = useNavigate()

  const handleInstant = () =>{

    const value = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    navigate(`/Preview/${value}`,{state:{name}})
  }

  return (
    <div className="h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-primary)]">

      {/* Card */}
      <div className="w-[380px] p-8 rounded-3xl bg-[var(--bg-card)] shadow-xl border border-white/10 backdrop-blur-md flex flex-col gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to VIVADCAM
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Join a room instantly
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm opacity-70">Your Name</label>
            <input
              type="text"
              name='name'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition"
              />
              {!name && <p style={{ color: "red" }}>Name is required</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm opacity-70">Room ID</label>
            <input
              type="text"
              placeholder="Enter room ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition"
            />
          </div>

        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/Preview/${id}`,{state:{name}})}
          className="mt-2 w-full py-3 rounded-xl font-semibold bg-[var(--text-primary)] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50"
          disabled={!id||!name}
        >
          Join Now
        </button>

        <hr /> 

        <button
          onClick={handleInstant}
          className="mt-2 w-full py-3 rounded-xl font-semibold bg-[var(--text-primary)] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50"
          disabled={!name}
        >
         + Create Instant Room
        </button>
    

      </div>

    </div>
  )
}