import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const VerifyToken = () => {
  const tokenRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    function fetchPhoneFromLocalStorage() {
      if (localStorage.getItem("phone")) {
        setPhone(localStorage.getItem("phone"));
        return;
      }

      return navigate("/passwordless-login");
    }

    fetchPhoneFromLocalStorage();
  }, [navigate]);

  async function handleTokenVerification(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone || "",
      token: tokenRef.current?.value || "",
      type: "sms",
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data.session) {
      localStorage.removeItem("phone");
      console.log(data);

      navigate("/profile");
    }
  }

  return (
    <div className="w-1/2 mx-auto mt-10 flex flex-col items-center justify-center">
      <form className="w-1/2" onSubmit={handleTokenVerification}>
        <label htmlFor="email" className="block text-sm">
          Email
        </label>
        <input
          id="token"
          name="token"
          type="text"
          ref={tokenRef}
          className="block w-full py-1 px-1 rounded border border-gray-200"
          placeholder="Enter your token"
        />
        <button
          type="submit"
          className="bg-green-400 border py-2 rounded-md w-full mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default VerifyToken;
