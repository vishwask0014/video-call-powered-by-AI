import React from 'react'

const LoginForm = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 mt-10 z-10">

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
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
                    />
                </div>

                {/* CTA */}
                <button className="col-span-2 mt-3 bg-[#9fbcc7] text-black font-bold py-3 rounded-xl 
            hover:translate-y-[2px] hover:shadow-none 
            shadow-[0_4px_0_0_black] transition-all duration-150">
                    ENTER SYSTEM
                </button>

                {/* FOOT NOTE */}
                <p className="col-span-2 text-xs text-white/40 text-center mt-2">
                    No cheating. Just skill.
                </p>
            </div>
        </>
    )
}

export default LoginForm