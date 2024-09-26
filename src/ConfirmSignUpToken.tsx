import { useRef } from "react";
import { supabase } from "./utils/supabaseClient";

const ConfirmSignUpToken = () => {
  const tokenRef = useRef<HTMLInputElement>(null);

  async function handleVerify(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.verifyOtp({
      email: "",
      token: tokenRef?.current?.value ?? "",
      type: "email",
    });

    console.log(data);
    console.log(error);
  }

  return (
    <div className="w-1/2">
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Token"
          className="block w-full rounded-md border-2 border-gray-200"
          ref={tokenRef}
        />
        <button type="submit" className="bg-green-400 rounded-md w-full mt-4">
          Verify
        </button>
      </form>
    </div>
  );
};

export default ConfirmSignUpToken;
