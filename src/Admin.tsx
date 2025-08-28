// import { useEffect } from "react";
import { supabaseAdminClient } from "./utils/supabaseAdminClient";

const Admin = () => {
  async function handleCreateUser() {
    const data = await supabaseAdminClient.auth.admin.createUser({
      email: "ssudaraka+6@gmail.com",
      password: "password",
      user_metadata: {
        first_name: "Supun",
        last_name: "Sudaraka",
      },
      app_metadata: {
        roles: ["admin"],
      },
    });

    console.log(data);
  }
  return (
    <>
      <div className="p-10">
        <h1>Admin</h1>
        <div>
          <button
            onClick={handleCreateUser}
            className="bg-red-200 px-4 py-2 rounded"
          >
            Create User
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;
