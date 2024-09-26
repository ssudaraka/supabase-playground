import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { supabase } from "./utils/supabaseClient";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function App() {
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

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }

    navigate("/");
  }

  return (
    <>
      <nav className="flex justify-between px-2 py-2 bg-white shadow w-full">
        <div className="mb-2 text-xl">
          <a href="/">Supabase Playground</a>
        </div>
        <div>
          {session ? (
            <>
              <a
                href="/profile"
                className="text-lg no-underline mr-2 text-gray-darkest hover:text-blue-800 ml-2"
              >
                Profile
              </a>
              <a
                href="#"
                className="text-lg no-underline mr-2 text-gray-darkest hover:text-blue-800 ml-2"
                onClick={handleLogout}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-lg no-underline mr-2 text-gray-darkest hover:text-blue-800 ml-2"
              >
                Login
              </a>
              <a
                href="/signup"
                className="text-lg no-underline mr-2 text-gray-darkest hover:text-blue-800 ml-2"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
