"use client";

import { addParams } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [num, setNum] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const confirm = () => {
    setInProgress(true);
    const ref = addParams("/aircraft", { registration: num });
    router.push(ref);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto my-auto flex flex-col gap-4 *:transition-all">
        <input
          type="text"
          onInput={(e) => setNum(e.currentTarget.value.toUpperCase())}
          value={num}
          placeholder="Enter Aircraft Registration"
          className="w-full rounded-2xl bg-slate-200 px-1 py-3 text-center text-3xl text-slate-700 shadow ring-slate-300 duration-75 outline-none focus:ring-4"
        />
        <button
          onClick={confirm}
          disabled={num.length == 0 || inProgress}
          className="mx-auto w-full max-w-80 cursor-pointer rounded-2xl bg-blue-500 p-4 text-center text-3xl text-slate-50 shadow hover:bg-blue-600 not-disabled:hover:shadow-lg not-disabled:active:scale-95 disabled:cursor-default disabled:bg-blue-300"
        >
          Go
        </button>
      </div>
    </div>
  );
}
