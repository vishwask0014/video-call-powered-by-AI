import React from "react";
import { bebas, grotesk } from "@/app/layout";
import LoginForm from "./LoginForm";

const Page = () => {
    return (
        <div className={`${grotesk.className} min-h-screen bg-[#071a1d] text-white flex`}>

            {/* LEFT PANEL */}
            <div className="w-1/2 p-10 flex flex-col justify-between border-r border-white/10 relative">

                {/* subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* TOP NAV */}
                <div className="flex items-center justify-between z-10">
                    <h2 className="font-bold tracking-widest text-white/80">KRYON AI</h2>
                    <button className="border border-white/30 px-4 py-1 text-sm rounded-full hover:bg-white hover:text-black transition">
                        LOGIN
                    </button>
                </div>

                {/* HERO TEXT */}
                <div className="z-10">
                    <h1 className={`${bebas.className} text-[90px] leading-[0.85] uppercase tracking-wide`}>
                        INTERVIEW <br /> WITHOUT <br /> CHEATING
                    </h1>

                    <p className="mt-5 text-sm text-white/60 max-w-md">
                        Real-time AI monitoring, tab detection, face tracking,
                        and behavior analysis — built for modern hiring.
                    </p>
                </div>

                {/* FORM */}
                <LoginForm />
            </div>

            {/* RIGHT PANEL (VIDEO) */}
            <div className="w-1/2 relative overflow-hidden">

                {/* VIDEO BACKGROUND */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/ai-bg.mp4" type="video/mp4" />
                </video>

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/40" />

                {/* GLOW EFFECT */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)]" />

                {/* OPTIONAL TEXT OVERLAY */}
                <div className="absolute bottom-6 left-6 text-white/60 text-xs tracking-widest">
                    AI MONITORING ACTIVE ●
                </div>
            </div>
        </div>
    );
};

export default Page;