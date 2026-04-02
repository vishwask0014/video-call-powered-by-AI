"use client";

import CreateMeetingForm from "@/app/components/CreateMeetingForm";
import JoinMeetingForm from "@/app/components/JoinMeetingForm";
import { ClipboardCopy, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const [activeBtn, setActiveBtn] = useState(1);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7fb] text-slate-900">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/70 via-rose-200/60 to-sky-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-emerald-200/60 via-teal-200/50 to-cyan-200/60 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Stream Video
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Start a video call in seconds
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Add your details, share an invite link, and choose whether to join
            or create a meeting.
          </p>
        </header>

        <div className="grid gap-6 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          {/* ========= 
              tab group + active Button On click fxn 
              ========= */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold transition ${activeBtn === 1 ? "bg-gradient-to-r text-white from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/30 " : null}`}
              onClick={() => setActiveBtn(1)}
            >
              Create meeting link
            </button>

            <button
              type="button"
              className={`h-12 rounded-2xl text-sm font-semibold transition ${activeBtn === 2 ? "bg-gradient-to-r text-white from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/30 " : null}`}
              onClick={() => setActiveBtn(2)}
            >
              Join call now
            </button>
          </div>
          {activeBtn === 1 ? <CreateMeetingForm /> : <JoinMeetingForm />}
        </div>
      </div>
    </div>
  );
};

export default Page;
