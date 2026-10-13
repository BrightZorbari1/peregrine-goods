"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterForm({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        setNote(data.error ?? "Something went wrong.");
      } else {
        setState("done");
        setNote(
          data.already
            ? "You're already on the list — first dibs, as always."
            : "Welcome in. First drop access is yours."
        );
      }
    } catch {
      setState("error");
      setNote("Could not subscribe right now.");
    }
  }

  if (state === "done") {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border px-5 py-3.5 text-sm ${
          dark ? "border-bone/25 text-bone" : "border-ink/15 text-ink"
        }`}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-clay" strokeWidth={1.5} />
        <span>{note}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex items-center gap-2 rounded-full border p-1.5 pl-5 transition focus-within:border-clay ${
          dark ? "border-bone/25" : "border-ink/20 bg-parchment"
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={`w-full bg-transparent text-sm placeholder:text-taupe ${
            dark ? "text-bone" : "text-ink"
          }`}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay text-bone transition hover:bg-clay-deep disabled:opacity-60"
          aria-label="Subscribe"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
      {state === "error" && <p className="mt-2 pl-2 text-xs text-clay">{note}</p>}
    </form>
  );
}
