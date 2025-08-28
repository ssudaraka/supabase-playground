import { useState } from "react";
import { supabase } from "./utils/supabaseClient";

function EnrollMfaPhone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [challenge, setChallenge] = useState("");

  async function handleEnroll() {
    const factor = await supabase.auth.mfa.enroll({
      factorType: "phone",
      friendlyName: "Supabase Playground Phone",
      phone: phoneNumber,
    });

    if (factor.error) {
      console.error(factor.error);
      return;
    }

    setFactorId(factor.data.id);
  }

  async function handleChallenge() {
    const challenge = await supabase.auth.mfa.challenge({
      factorId: factorId,
    });

    if (challenge.error) {
      console.error(challenge.error);
      return;
    }

    setChallenge(challenge.data.id);
  }

  async function handleVerify() {
    const verify = await supabase.auth.mfa.verify({
      factorId: factorId,
      challengeId: challenge,
      code: verifyCode,
    });

    if (verify.error) {
      console.error(verify.error);
      return;
    }

    console.log(verify);
    console.log("Enrolled successfully");
  }

  return (
    <>
      <input
        type="text"
        className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value.trim())}
      />
      <input
        type="text"
        className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="verification code"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <button
        className="mt-3 ml-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleEnroll}
      >
        Enroll
      </button>
      <button
        className="mt-3 ml-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleChallenge}
      >
        Challenge
      </button>
      <button
        className="mt-3 ml-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleVerify}
      >
        Verify
      </button>
    </>
  );
}

export default EnrollMfaPhone;
