"use client";

import Button from "@/components/Button";
import { addParams, REGISTRATION_REGEX } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [reg, setReg] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const confirm = () => {
    if (!REGISTRATION_REGEX.test(reg)) {
      alert("Invalid registration");
      return;
    }
    setInProgress(true);
    const ref = addParams("/aircraft", { registration: reg });
    router.push(ref);
    setInProgress(false);
  };

  return (
    <div className="mx-auto my-auto flex flex-col gap-4 *:transition-all">
      <input
        type="text"
        spellCheck="false"
        onInput={(e) => setReg(e.currentTarget.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (reg.length == 0 || inProgress) return;
            confirm();
          }
        }}
        value={reg}
        placeholder="Enter Aircraft Registration"
        className="w-full rounded-2xl bg-slate-200 px-1 py-3 text-center text-3xl text-slate-700 shadow ring-slate-300 duration-75 outline-none focus:ring-4"
      />
      <div className="mx-auto flex min-w-80">
        <Button onClick={confirm} disabled={reg.length == 0 || inProgress}>
          <span className="text-3xl">Go</span>
        </Button>
      </div>
    </div>
  );
}
