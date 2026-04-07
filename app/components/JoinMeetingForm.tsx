import { ClipboardCopy, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const JoinMeetingForm = () => {
  const [copied, setCopied] = useState(false);
  const [fullName, setFullName] = useState("");
  const [unqiueUserName, setUniqueUserName] = useState("");
  const [loadingUserName, setLoadingUserName] = useState(true);

  const handleCopy = async ({ value }: { value: string }) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

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

  // --- This is the path which help to connect call
  // https://myapp.com/join?call_id=123&call_type=default

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Full Name
          <input
            type="text"
            placeholder="alex_j"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            value={fullName}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 relative">
          Username (auto-generated)
          <input
            disabled
            type="text"
            placeholder="Unique username"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={loadingUserName ? "Generating..." : unqiueUserName}
          />
          <span
            onClick={() => handleCopy({ value: unqiueUserName })}
            className="absolute right-5 pt-6 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
          >
            {copied ? <Copy /> : <ClipboardCopy />}
          </span>
        </label>

        <button className="h-12 col-span-2 mt-4 rounded-2xl border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900">
          Start Call
        </button>
      </div>
    </>
  );
};

export default JoinMeetingForm;
