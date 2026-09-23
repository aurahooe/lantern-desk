"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeskForm() {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Sign in first.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("lantern_slips").insert({
      author_id: user.id,
      title,
      body,
      is_public: isPublic,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="title" maxLength={80} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="the slip itself" maxLength={2000} />
      <label className="chk">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Put this on the porch (public)
      </label>
      {err && <p className="err">{err}</p>}
      <button className="btn solid" disabled={busy} type="submit">{busy ? "Saving…" : "Save slip"}</button>
    </form>
  );
}
