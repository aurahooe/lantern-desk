import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";

export const revalidate = 30;

export default async function Home() {
  const supabase = createClient();
  const [{ data: hours }, { data: slips }] = await Promise.all([
    supabase.from("lantern_hours").select("*").order("created_at", { ascending: false }).limit(1),
    supabase.from("lantern_slips").select("id,title,body,created_at,author_id").eq("is_public", true).order("created_at", { ascending: false }).limit(24),
  ]);

  const hour = hours?.[0];

  return (
    <div className="wrap">
      <Nav />
      <section className="hero">
        <div>
          <h2>Leave a slip on the porch. Keep the rest in the drawer.</h2>
          <p className="lead">
            Public notes sit out here. Private ones stay with your account. Every hour a new card lands on the desk.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Link className="btn solid" href="/desk">Write a slip</Link>
            <Link className="btn" href="/login">Sign in</Link>
          </div>
        </div>
        <article className="hour-card">
          <div className="kicker">This hour</div>
          <h3>{hour?.title || "The desk is warming"}</h3>
          <p>{hour?.body || "First feature arrives on the hour."}</p>
        </article>
      </section>

      <h3 className="section-title">On the porch</h3>
      <p className="sub">Only slips marked public. Nothing else leaves the drawer.</p>
      <div className="grid">
        {(slips || []).length === 0 && (
          <article className="slip">
            <h4>Empty rail</h4>
            <p>No public slips yet. Sign in and pin one out here if you want company.</p>
          </article>
        )}
        {(slips || []).map((s, i) => (
          <article className="slip" key={s.id} style={{ animationDelay: `${i * 40}ms` }}>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
            <div className="meta">
              <span>public</span>
              <span>{new Date(s.created_at).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
