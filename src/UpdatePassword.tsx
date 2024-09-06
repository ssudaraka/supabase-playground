import { FormEvent, useRef } from "react";
import { supabase } from "./utils/supabaseClient";

const UpdatePassword = () => {
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleUpdatePassword(event: FormEvent) {
    event.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      password: passwordRef?.current?.value ?? "",
    });

    console.log(data);
    console.log(error);
  }

  return (
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleUpdatePassword}>
        <input type="text" placeholder="password" ref={passwordRef}></input>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
