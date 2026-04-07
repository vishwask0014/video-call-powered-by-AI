"use client";

import { ClipboardCopy, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/stores/user_store";
import { formatCallUrl } from "@/app/lib/utils";

const Page = () => {
  const { user, setUser, roomId, setRoomId, generateAndSetRoomId } = useUserStore();
  const [inviteLink, setInviteLink] = useState("");
  const [activeBtn, setActiveBtn] = useState(1);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: ""
  });

  useEffect(() => {
    if (roomId) {
      setInviteLink(formatCallUrl(roomId));
    }
  }, [roomId]);

  const handleCreateMeeting = () => {
    if (formData.fullName && formData.username) {
      const newRoomId = generateAndSetRoomId();
      setUser({
        id: formData.username,
        name: formData.fullName,
        username: formData.username
      });
      window.location.href = `/video/${newRoomId}`;
    }
  };

  const handleJoinCall = () => {
    if (formData.fullName) {
      const username = formData.username || formData.fullName.toLowerCase().replace(/\s+/g, '_');
      setUser({
        id: username,
        name: formData.fullName,
        username: username
      });
      window.location.href = `/video/${roomId || 'default-room'}`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

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
          {activeBtn === 1 ? (
            <>
              {" "}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Full name
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Username
                  <input
                    type="text"
                    placeholder="alex_j"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
                  Profile image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full cursor-pointer rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-300"
                  />
                </label>
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Invite meeting link
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="h-12 rounded-2xl w-34 flex items-center gap-3 hover:cursor-pointer border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    {copied ? <ClipboardCopy /> : <Copy />}{" "}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Share this link with others so they can join instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateMeeting}
                disabled={!formData.fullName || !formData.username}
                className="h-12 rounded-2xl w-34 flex items-center gap-3 hover:cursor-pointer border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create & Join Meeting
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Full Name
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700 relative">
                Room ID (optional)
                <input
                  type="text"
                  placeholder="Enter room ID or leave empty"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <button 
                onClick={handleJoinCall}
                disabled={!formData.fullName}
                className="h-12 col-span-2 mt-4 rounded-2xl border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
