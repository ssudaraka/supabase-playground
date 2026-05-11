import { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";

interface MfaFactor {
  id: string;
  friendly_name: string;
  factor_type: string;
  status: string;
  created_at: string;
}

function EnrollMfaTotp() {
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [factorsLoading, setFactorsLoading] = useState(true);
  const [factorId, setFactorId] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [qr, setQr] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [enrollStep, setEnrollStep] = useState<
    "idle" | "name" | "qr" | "verifying"
  >("idle");

  useEffect(() => {
    fetchFactors();
  }, []);

  async function fetchFactors() {
    setFactorsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        console.error(error);
        setFactors([]);
        return;
      }
      const totpFactors = (data?.totp ?? []) as MfaFactor[];
      setFactors(totpFactors);
    } catch (err) {
      console.error(err);
      setFactors([]);
    } finally {
      setFactorsLoading(false);
    }
  }

  async function handleEnroll(friendlyName: string) {
    setEnrollStep("qr");
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: friendlyName.trim() || "Authenticator App",
    });

    if (error) {
      console.error(error);
      setEnrollStep("name");
      return;
    }

    setFactorId(data?.id ?? "");
    setQr(data?.totp?.qr_code ?? "");
  }

  async function handleChallengeAndVerify() {
    setEnrollStep("verifying");
    // const challenge = await supabase.auth.mfa.challenge({
    //   factorId: factorId,
    // });

    // if (challenge.error) {
    //   console.error(challenge.error);
    //   setEnrollStep("qr");
    //   return;
    // }

    // const challengeId = challenge.data.id;

    // const verify = await supabase.auth.mfa.verify({
    //   factorId: factorId,
    //   challengeId: challengeId,
    //   code: verifyCode,
    // });

    // if (verify.error) {
    //   console.error(verify.error);
    //   setEnrollStep("qr");
    //   return;
    // }

    // setVerifyCode("");
    // setQr("");
    // setFactorId("");
    // setEnrollStep("idle");
    // fetchFactors();

    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factorId,
      code: verifyCode,
    });

    console.log(data);

    if (error) {
      console.error(error);
      setEnrollStep("qr");
      return;
    }

    setVerifyCode("");
    setQr("");
    setFactorId("");
    setEnrollStep("idle");
    fetchFactors();
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        dateStyle: "medium",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Multi-Factor Authentication (TOTP)
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Add an authenticator app to secure your account with two-factor
          authentication.
        </p>
      </div>

      {/* Current MFA devices */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-2 flex items-center text-2xl font-semibold text-gray-900">
          <svg
            className="mr-2 h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Your enrolled MFA devices
        </h2>
        <p className="mb-6 text-gray-600">
          Authenticator apps and devices that can be used to sign in.
        </p>

        {factorsLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : factors.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No MFA devices enrolled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add an authenticator app below to enable two-factor
              authentication.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {factors.map((factor) => (
              <li
                key={factor.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {factor.friendly_name || "Authenticator app"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {factor.factor_type.toUpperCase()} · Enrolled{" "}
                      {formatDate(factor.created_at)}
                    </p>
                  </div>
                </div>
                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new authenticator */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-2 flex items-center text-2xl font-semibold text-gray-900">
          <svg
            className="mr-2 h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add authenticator app
        </h2>
        <p className="mb-6 text-gray-600">
          Scan the QR code with an app like Google Authenticator or Authy, then
          enter the code to verify.
        </p>

        {enrollStep === "idle" && (
          <button
            type="button"
            onClick={() => setEnrollStep("name")}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Enroll TOTP
          </button>
        )}

        {enrollStep === "name" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">
              Provide a name to identify MFA app
            </p>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. My iPhone, Google Authenticator"
              className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleEnroll(deviceName)}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnrollStep("idle");
                  setDeviceName("");
                }}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {(enrollStep === "qr" || enrollStep === "verifying") && qr && (
          <div className="space-y-6">
            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6">
              <p className="mb-4 text-sm font-medium text-gray-700">
                Scan with your authenticator app
              </p>
              {qr.startsWith("data:") ? (
                <img
                  src={qr}
                  alt="TOTP QR code"
                  className="h-48 w-48 rounded-lg bg-white p-2"
                />
              ) : (
                <div
                  className="rounded-lg bg-white p-4"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
              )}
            </div>
            <div>
              <label
                htmlFor="verify-code"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Verification code
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleChallengeAndVerify}
                disabled={verifyCode.length !== 6 || enrollStep === "verifying"}
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enrollStep === "verifying" ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Enable"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnrollStep("idle");
                  setDeviceName("");
                  setQr("");
                  setFactorId("");
                  setVerifyCode("");
                }}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="text-center">
        <a
          href="/profile"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ← Back to Profile
        </a>
      </div>
    </div>
  );
}

export default EnrollMfaTotp;
