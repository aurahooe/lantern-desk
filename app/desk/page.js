import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import DeskForm from "@/components/DeskForm";

export default async function DeskPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: slips } = await supabase
    .from("lantern_slips")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="wrap">
      <Nav />
      <h2 className="section-title">Your drawer</h2>
      <p className="sub">Write freely. Tick public only if you want it on the porch.</p>
      <DeskForm />
      <div className="grid" style={{ marginTop: 28 }}>
        {(slips || []).map((s) => (
          <article className="slip" key={s.id}>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
            <div className="meta">
              <span>{s.is_public ? "on the porch" : "in the drawer"}</span>
              <span>{new Date(s.created_at).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
