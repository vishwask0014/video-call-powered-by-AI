"use client";

import { useEffect, useState } from "react";
import { ClipboardCopy, Copy } from "lucide-react";

const CreateMeetingForm = () => {
  const [inviteLink, setInviteLink] = useState(
    "https://video-call-powered-by-ai.vercel.app/video/my-first-call",
  );
  const [userProfileImage, setUserProfileImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullName, setFullName] = useState("");
  const [uniqueUsername, setUniqueUserName] = useState("");
  const [loadingUserName, setLoadingUserName] = useState(true);

  useEffect(() => {
    const createUserName = setTimeout(() => {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const number = "0123456789";

      // get random 3 alphabet and 3 number and combine them as suffix
      const randomSuffix =
        Array.from(
          { length: 3 },
          () => alphabet[Math.floor(Math.random() * alphabet.length)],
        ).join("") +
        Array.from(
          { length: 3 },
          () => number[Math.floor(Math.random() * number.length)],
        ).join("");

      const finalUserName = fullName.replaceAll(" ", "") + "-" + randomSuffix;

      if (fullName.length > 0) {
        setUniqueUserName(finalUserName);
        setLoadingUserName(false);
      }
    }, 3000);

    return () => clearTimeout(createUserName);
  }, [fullName]);

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
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Full name
          <input
            type="text"
            placeholder="Alex Johnson"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Username
          <input
            type="text"
            placeholder="alex_j"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            onChange={(e) => setUniqueUserName(e.target.value)}
            value={loadingUserName ? "Generating..." : uniqueUsername}
          />
        </label>

        {/* <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
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
        </label> */}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium text-slate-700">
          Invite meeting link
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={inviteLink}
            onChange={(event) => setInviteLink(event.target.value)}
            className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 rounded-2xl w-34 flex items-center gap-3 hover:cursor-pointer border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {copied ? <ClipboardCopy /> : <Copy />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Share this link with others so they can join instantly.
        </p>
      </div>
    </>
  );
};

export default CreateMeetingForm;
