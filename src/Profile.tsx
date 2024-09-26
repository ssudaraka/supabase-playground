import { useRef } from "react";
import { supabase } from "./utils/supabaseClient";

// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function Profile() {
  const otpRef = useRef<HTMLInputElement>(null);

  const handleGetSession = async () => {
    const data = await supabase.auth.getSession();
    console.log(data);
  };

  const handleGetUser = async () => {
    const data = await supabase.auth.getUser();
    console.log(data);
  };

  const handleRefreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    console.log(data);
    console.log(error);
  };

  const handlePhoneUpdate = async () => {
    const { data, error } = await supabase.auth.updateUser({
      phone: "94771867199",
    });

    if (error) {
      console.log("error occurred while trying to update user's phone number");
      console.error(error);
      return;
    }

    console.log(data);
  };

  const handleOtpVerification = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: "94771867199",
      token: otpRef.current?.value || "",
      type: "phone_change",
    });

    if (error) {
      console.log("error occurred while trying to verify the otp");
      console.error(error);
      return;
    }

    console.log(data);
  };
  // const otpRef = useRef<HTMLInputElement>(null);

  // async function handleUpdatePhone() {
  //   const { data, error } = await supabase.auth.updateUser({
  //     phone: "+94713522343",
  //   });

  //   if (error) {
  //     console.log("error occurred while trying to update user's phone number");
  //     console.error(error);
  //     return;
  //   }

  //   console.log(data);
  // }

  // async function handleGetUser() {
  //   const data = await supabase.auth.getUser();
  //   console.log(data);
  // }

  // async function handleGetSession() {
  //   const data = await supabase.auth.getSession();
  //   console.log(data);
  // }

  // async function handleOtpVerification() {
  //   if (otpRef.current) {
  //     const { data, error } = await supabase.auth.verifyOtp({
  //       phone: "+94713522343",
  //       token: otpRef.current.value,
  //       type: "phone_change",
  //     });

  //     if (error) {
  //       console.log("error occurred while trying to verify the otp");
  //       console.error(error);
  //       return;
  //     }

  //     console.log(data);
  //   }
  // }

  // return (
  //   <>
  //     <h1>Profile</h1>
  //     <button
  //       className="bg-blue-500 text-white py-2 px-4 rounded"
  //       onClick={handleGetUser}
  //     >
  //       Get user
  //     </button>
  //     <button
  //       className="bg-blue-500 text-white py-2 px-4 rounded"
  //       onClick={handleGetSession}
  //     >
  //       Get session
  //     </button>
  //     <button
  //       className="bg-blue-500 text-white py-2 px-4 rounded"
  //       onClick={handleUpdatePhone}
  //     >
  //       Update phone
  //     </button>
  //     <br />
  //     <input
  //       className="shadow border"
  //       type="text"
  //       id="otp"
  //       placeholder="Enter your OTP"
  //       ref={otpRef}
  //     />
  //     <button
  //       className="bg-blue-500 text-white py-2 px-4 rounded"
  //       onClick={handleOtpVerification}
  //     >
  //       Verify OTP
  //     </button>
  //   </>
  // );

  return (
    <div className="px-2 py-2">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleGetSession}
      >
        Get Session
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleGetUser}
      >
        Get User
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
        onClick={handleRefreshSession}
      >
        Refresh Session
      </button>
      <a
        href="/change-email"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Email
      </a>
      <a
        href="/change-phone"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Phone
      </a>
      <a
        href="/update-password"
        className="bg-blue-500 text-white py-2 px-4 mr-2 rounded"
      >
        Change Password
      </a>
    </div>
  );
}

export default Profile;
