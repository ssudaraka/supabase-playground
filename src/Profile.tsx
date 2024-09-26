import { useRef } from "react";
import { supabase } from "./utils/supabaseClient";

// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function Profile() {
  const handleGetSession = async () => {
    const data = await supabase.auth.getSession();
    console.log(data);
  };

  const handleGetUser = async () => {
    const data = await supabase.auth.getUser();
    console.log(data);
  };

  const handleRefreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    console.log(data);
    console.log(error);
  };

  return (
    <div className="px-2 py-2">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleGetSession}
      >
        Get Session
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleGetUser}
      >
        Get User
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleRefreshSession}
      >
        Refresh Session
      </button>
      <a
        href="/change-email"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Email
      </a>
      <a
        href="/change-phone"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Phone
      </a>
      <a
        href="/update-password"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Password
      </a>
    </div>
  );
}

export default Profile;
