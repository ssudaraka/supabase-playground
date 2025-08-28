import { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";

function Realtime() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const roomOne = supabase.channel("room-one", {
      config: {
        broadcast: { self: true },
      },
    });

    roomOne
      .on("broadcast", { event: "test" }, (payload) => {
        console.log("Received message:", payload);
        const newMessage = {
          id: Date.now().toString(),
          message: payload.payload.message,
          timestamp: new Date(),
          sender: "Other User",
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessageCount((prev) => prev + 1);
      })
      .on("presence", { event: "sync" }, () => {
        console.log("Presence synced");
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
        setIsConnected(true);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    return () => {
      roomOne.unsubscribe();
    };
  }, []);

  function handleSendMessage() {
    const message = `Hello from ${new Date().toLocaleTimeString()}`;
    console.log("Sending message:", message);

    const newMessage = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      sender: "You",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageCount((prev) => prev + 1);

    supabase.channel("room-one").send({
      type: "broadcast",
      event: "test",
      payload: { message },
    });
  }

  function handleClearMessages() {
    setMessages([]);
    setMessageCount(0);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Realtime Messaging
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Experience real-time communication with WebSocket connections and live
          message broadcasting.
        </p>
      </div>

      {/* Connection Status */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <div
            className={`h-3 w-3 rounded-full ${isConnected ? "animate-pulse bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm font-medium text-gray-900">
            {isConnected
              ? "Connected to real-time channel"
              : "Connecting to real-time channel..."}
          </span>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isConnected
            ? "Messages will be broadcast to all connected users."
            : "Please wait while we establish the connection."}
        </p>
      </div>

      {/* Message Controls */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Message Controls
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Send Test Message
          </button>

          <button
            onClick={handleClearMessages}
            disabled={messages.length === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear Messages
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Message History
          {messageCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({messageCount} {messageCount === 1 ? "message" : "messages"})
            </span>
          )}
        </h2>

        {messages.length === 0 ? (
          <div className="py-8 text-center">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No messages yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Send a test message to see real-time communication in action.
            </p>
          </div>
        ) : (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                    message.sender === "You"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="mb-1 flex items-center space-x-2">
                    <span className="text-xs font-medium opacity-75">
                      {message.sender}
                    </span>
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
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
            Messages are sent through Supabase's real-time WebSocket connection.
            All connected users in the same room will receive the broadcast
            messages instantly.
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Real-time Features
          </h3>
          <p className="text-sm text-gray-600">
            This demonstrates presence tracking, message broadcasting, and
            real-time updates. Perfect for chat applications, live dashboards,
            and collaborative features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Realtime;
