import { supabase } from "./utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const PasswordlessLoginEmail = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  async function handlePasswordlessLogin(e) {
    e.preventDefault();

    if (emailRef.current) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: emailRef.current.value,
        options: {
          data: {
            fname: "supun",
            lname: "sudaraka",
          },
        },
      });

      if (error) {
        console.log(error);
        return;
      }

      console.log(data);

      // if (data) {
      //   console.log(data);
      //   localStorage.setItem("phone", phoneRef.current.value);
      //   navigate("/verify-token");
      // }
    }
  }

  async function handleResend() {
    console.log("Resend");

    if (emailRef.current) {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: emailRef?.current?.value,
      });

      console.log(data);
      console.log(error);
    }
  }

  return (
    <div className="w-1/2 mx-auto mt-10 flex flex-col items-center justify-center">
      <form className="w-1/2" onSubmit={handlePasswordlessLogin}>
        <label htmlFor="email" className="block text-sm">
          Phone
        </label>
        <input
          id="email"
          name="email"
          type="text"
          ref={emailRef}
          className="block w-full py-1 px-1 rounded border border-gray-200"
          placeholder="Enter your Enter your email"
        />
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

export default PasswordlessLoginEmail;
