import { FormEvent, useRef } from "react";
import { supabase } from "./utils/supabaseClient";

const ChangeEmail = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleUpdateEmail(event: FormEvent) {
    event.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      email: emailRef?.current?.value ?? "",
    });

    console.log(data);
    console.log(error);
  }

  return (
    <div className="px-2 py-2">
      <h1 className="text-2xl font-bold text-gray-900">Update Email</h1>
      <form onSubmit={handleUpdateEmail}>
        <input
          type="email"
          className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          ref={emailRef}
        ></input>
        <button
          type="submit"
          className="mt-3 ml-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ChangeEmail;
