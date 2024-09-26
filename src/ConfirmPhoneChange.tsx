import { FormEvent, useRef } from "react";
import { supabase } from "./utils/supabaseClient";

const ConfirmPhoneChange = () => {
  const tokenRef = useRef<HTMLInputElement>(null);

  async function handleUpdatePhone(event: FormEvent) {
    event.preventDefault();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: "94713522343",
      token: tokenRef?.current?.value ?? "",
      type: "phone_change",
    });

    console.log(data);
    console.log(error);
  }

  return (
    <div className="px-2 py-2">
      <h1 className="text-2xl font-bold text-gray-900">Confirm phone change</h1>
      <form onSubmit={handleUpdatePhone}>
        <input
          type="text"
          className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Token"
          ref={tokenRef}
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

export default ConfirmPhoneChange;
