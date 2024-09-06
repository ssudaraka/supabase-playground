import { supabase } from "./utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const PasswordlessLogin = () => {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLInputElement>(null);

  async function handlePasswordlessLogin(e) {
    e.preventDefault();

    if (phoneRef.current) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneRef.current.value,
      });

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
        localStorage.setItem("phone", phoneRef.current.value);
        navigate("/verify-token");
      }
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

export default PasswordlessLogin;
