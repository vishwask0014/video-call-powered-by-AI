'use client'

import { Eye, EyeClosed } from 'lucide-react'
import React, { useState } from 'react'

const SignupForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-10 z-10">

        {/* Full Name */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-white/50">Full Name</label>
          <input
            type="text"
            placeholder="David Paul"
            className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
          />
        </div>

        {/* EMAIL */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-white/50">EMAIL</label>
          <input
            placeholder="you@example.com"
            className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-white/50">PASSWORD</label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••"
              className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition w-full"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {
                isPasswordVisible ?
                  <Eye color='#9fbcc7' />
                  :
                  <EyeClosed color='#9fbcc7' />
              }
            </span>
          </div>
        </div>


        {/* CTA */}
        <button className="col-span-2 mt-3 bg-[#9fbcc7] text-black font-bold py-3 rounded-xl 
             hover:shadow-none mx-auto w-full px-4 transition-all duration-300"
        >
          ENTER SYSTEM
        </button>

        {/* FOOT NOTE */}
        <p className="col-span-2 text-xs text-white/40 text-center mt-2">
          No cheating. Just skill.
        </p>
      </div></>
  )
}

export default SignupForm