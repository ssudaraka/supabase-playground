import { useRef, FormEvent } from "react";
import { supabase } from "./utils/supabaseClient";

// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleForgotPassword(event: FormEvent) {
    event.preventDefault();
    const email = emailRef?.current?.value || "";
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
    return;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>Forgot Password</h1>
        <form className="mt-2" onSubmit={handleForgotPassword}>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            ref={emailRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
          />
          <button
            type="submit"
            className="bg-green-400 border py-2 rounded-md w-full mt-4"
          >
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
