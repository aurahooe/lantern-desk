"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. If email confirm is on, check your inbox. Otherwise you can sign in now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/desk");
        router.refresh();
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap">
      <header className="top">
        <Link className="mark" href="/">
          <h1>Lantern Desk</h1>
          <span>sign in</span>
        </Link>
      </header>
      <h2 className="section-title">{mode === "signup" ? "Make a desk" : "Open your drawer"}</h2>
      <p className="sub">Email and password. Your private slips never hit the porch unless you say so.</p>
      <form className="stack" onSubmit={onSubmit}>
        <input type="email" required placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={6} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button className="btn solid" disabled={busy} type="submit">
          {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          {mode === "signup" ? "Have an account? Sign in" : "New here? Create one"}
        </button>
      </form>
    </div>
  );
}
