import { supabase } from "./utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

const PasswordlessLogin = () => {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  async function handlePasswordlessLogin(e) {
    e.preventDefault();

    if (phoneRef.current) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneRef.current.value,
        options: {
          captchaToken: captchaToken
        }
      });

      if (error) {
        console.log(error);
        return;
      }

      console.log(data);

      if (data) {
        console.log(data);
        localStorage.setItem("phone", phoneRef.current.value);
        navigate("/verify-token");
      }
    }
  }

  async function handleResend() {
    console.log("Resend");

    if (phoneRef.current) {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: phoneRef?.current?.value,
      });

      console.log(data);
      console.log(error);
    }
  }

  return (
    <div className="w-1/2 mx-auto mt-10 flex flex-col items-center justify-center">
      <form className="w-1/2" onSubmit={handlePasswordlessLogin}>
        <label htmlFor="phone" className="block text-sm">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          ref={phoneRef}
          className="block w-full py-1 px-1 rounded border border-gray-200"
          placeholder="Enter your phone number"
        />
        <Turnstile siteKey="0x4AAAAAACOFSkopvZxoXAcL" onSuccess={(token) => setCaptchaToken(token)} />
        <button
          type="submit"
          className="bg-green-400 border py-2 rounded-md w-full mt-4"
        >
          Login
        </button>
      </form>
      <div className="w-1/2">
        <button
          onClick={handleResend}
          className="bg-green-400 border py-2 rounded-md w-full mt-4"
        >
          Resend
        </button>
      </div>
    </div>
  );
};

export default PasswordlessLogin;
