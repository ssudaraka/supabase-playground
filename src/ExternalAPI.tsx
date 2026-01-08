import { useState } from "react";
import { supabase } from "./utils/supabaseClient";

function ExternalAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState("http://localhost:3001");

  const handleApiCall = async () => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      if (!apiUrl.trim()) {
        setError("Please enter a valid API URL");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data2 = await response.json();
      setResponseData(data2);
      console.log("API Response:", data2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while making the API call",
      );
      console.error("API call error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          External API Call
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Test external API calls and see the responses in real-time. Enter any
          public API endpoint to make requests.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            API Request
          </h2>
          <p className="text-gray-600">
            Enter an API endpoint URL and click the button to make a GET
            request.
          </p>
        </div>

        {/* API URL Input */}
        <div className="mb-6">
          <label
            htmlFor="apiUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            API Endpoint URL
          </label>
          <input
            id="apiUrl"
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://api.example.com/endpoint"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: https://jsonplaceholder.typicode.com/posts/1
          </p>
        </div>

        {/* Call Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleApiCall}
            disabled={isLoading}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Making Request...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Make API Call
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Display */}
        {responseData && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">
                  Response Received
                </h3>
                <div className="mt-2">
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-green-100 p-3 text-sm text-green-700">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            How it works
          </h3>
          <p className="text-sm text-gray-600">
            Enter any public API endpoint URL and click the button to make a GET
            request. The response will be displayed in JSON format below.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5 text-purple-600"
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
            Security Note
          </h3>
          <p className="text-sm text-gray-600">
            This tool makes direct API calls from your browser. Be cautious when
            calling APIs that require authentication or sensitive data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExternalAPI;
