import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./utils/supabaseClient";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Navbar from "./components/Navbar";

function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then((data) => {
      setSession(data.data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("auth state changed");
      console.log("event:", _event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar session={session} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
