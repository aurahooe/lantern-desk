import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="top">
      <Link className="mark" href="/">
        <h1>Lantern Desk</h1>
        <span>hourly porch</span>
      </Link>
      <nav className="topnav">
        <Link className="btn ghost" href="/">Porch</Link>
        <Link className="btn ghost" href="/desk">Desk</Link>
        {user ? (
          <form action="/auth/signout" method="post">
            <button className="btn" type="submit">Sign out</button>
          </form>
        ) : (
          <Link className="btn solid" href="/login">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
