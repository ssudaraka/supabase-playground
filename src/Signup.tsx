import { FormEvent, useRef } from "react";
import { supabase } from "./utils/supabaseClient";
import { useNavigate } from "react-router-dom";

// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function Signup() {
  const navigate = useNavigate();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSignup(event: FormEvent) {
    event.preventDefault();

    if (emailRef.current && passwordRef.current) {
      const { data, error } = await supabase.auth.signUp({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        options: {
          emailRedirectTo: "http://localhost:3000",
          data: {
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
          },
        },
      });

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        console.log(data);
        navigate("/login");
      }
    }

    return;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center text-2xl mt-4">Create an account</h2>
        <form className="mt-2" onSubmit={handleSignup}>
          <label htmlFor="firstName" className="block text-sm">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            ref={firstNameRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
          />
          <label htmlFor="lastName" className="block text-sm">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            ref={lastNameRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
          />
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
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
          />
          <button
            type="submit"
            className="bg-green-400 border py-2 rounded-md w-full mt-4"
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
