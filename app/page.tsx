"use client";

import { ClipboardCopy, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState("");
  const [activeBtn, setActiveBtn] = useState(1);
  const [userProfileImage, setUserProfileImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    joinFullName: "",
    joinLink: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Generate unique room ID
  const generateRoomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate username from full name
  const generateUsername = (fullName: string) => {
    if (!fullName) return "";
    const names = fullName.toLowerCase().split(' ');
    const firstName = names[0] || "";
    const lastName = names[names.length - 1] || "";
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName}_${lastName.charAt(0)}${randomNum}`;
  };

  // Create meeting link
  const createMeeting = async () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    setIsCreating(true);
    
    try {
      const roomId = generateRoomId();
      const username = formData.username || generateUsername(formData.fullName);
      const meetingLink = `${window.location.origin}/video/${roomId}`;
      
      // Store user data in localStorage for the video call
      localStorage.setItem('user', JSON.stringify({
        id: username,
        name: formData.fullName,
        username: username,
        role: 'host'
      }));
      
      setInviteLink(meetingLink);
      setFormData(prev => ({ ...prev, username }));
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push(`/video/${roomId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Join meeting
  const joinMeeting = async () => {
    if (!formData.joinFullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!formData.joinLink.trim()) {
      alert('Please enter a meeting link');
      return;
    }

    setIsJoining(true);

    try {
      // Extract room ID from link
      const urlMatch = formData.joinLink.match(/\/video\/([a-zA-Z0-9-]+)/);
      if (!urlMatch) {
        throw new Error('Invalid meeting link');
      }

      const roomId = urlMatch[1];
      const username = generateUsername(formData.joinFullName);

      // Store user data in localStorage for the video call
      localStorage.setItem('user', JSON.stringify({
        id: username,
        name: formData.joinFullName,
        username: username,
        role: 'participant'
      }));

      // Redirect to the meeting
      router.push(`/video/${roomId}`);
      
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Invalid meeting link. Please check and try again.');
    } finally {
      setIsJoining(false);
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
        <header className="space-y-2 flex justify-between ">
          <div>
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
          </div>


          <Link href="/test-video" className="border w-fit h-fit rounded-lg px-6 py-3 text-white bg-emerald-600 font-medium ">
            Test Video
          </Link>

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
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Username (optional)
                  <input
                    type="text"
                    placeholder="alex_j"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
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
                  {userProfileImage && (
                    <Image
                      width={50}
                      height={50}
                      className="rounded-full object-cover border-2 border-slate-black text-black"
                      alt="user profile image"
                      src=""
                    />
                  )}
                </label>
              </div>
              
              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Meeting link
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    placeholder="Click 'Create Meeting' to generate link"
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!inviteLink}
                    className="h-12 rounded-2xl w-34 flex items-center gap-3 hover:cursor-pointer border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied ? <ClipboardCopy /> : <Copy />}{" "}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {inviteLink ? "Share this link with others so they can join instantly." : "Create a meeting to generate your invite link."}
                </p>
              </div>
              
              <button
                onClick={createMeeting}
                disabled={isCreating || !formData.fullName.trim()}
                className="h-12 rounded-2xl border border-slate-900 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : inviteLink ? "Join Meeting" : "Create Meeting"}
              </button>
              
              {inviteLink && (
                <div className="text-center text-sm text-emerald-600 font-medium">
                  Meeting created! You'll be redirected automatically...
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Full Name
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.joinFullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, joinFullName: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Meeting Link
                <input
                  type="text"
                  placeholder="Paste meeting link here"
                  value={formData.joinLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, joinLink: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <button
                onClick={joinMeeting}
                disabled={isJoining || !formData.joinFullName.trim() || !formData.joinLink.trim()}
                className="h-12 rounded-2xl border border-slate-900 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? "Joining..." : "Join Meeting"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
