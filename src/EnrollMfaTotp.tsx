import { useState } from "react";
import { supabase } from "./utils/supabaseClient";

function EnrollMfaTotp() {
  const [factorId, setFactorId] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [qr, setQr] = useState(""); // holds the QR code image SVG

  async function handleEnroll() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Supabase Playground",
    });

    if (error) {
      console.error(error);
      return;
    }

    setFactorId(data?.id);
    setQr(data?.totp.qr_code);
  }

  async function handleChallengeAndVerify() {
    const challenge = await supabase.auth.mfa.challenge({
      factorId: factorId,
    });

    if (challenge.error) {
      console.error(challenge.error);
      return;
    }

    const challegeId = challenge.data.id;

    const verify = await supabase.auth.mfa.verify({
      factorId: factorId,
      challengeId: challegeId,
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
      <button className="border-red-100" onClick={handleEnroll}>
        Enroll
      </button>
      <img src={qr} />
      <input
        type="text"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <button onClick={handleChallengeAndVerify}>Enable</button>
    </>
  );
}

export default EnrollMfaTotp;
