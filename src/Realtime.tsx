import { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";

function Realtime() {
  const channel = supabase.channel("test-channel");

  useEffect(() => {
    channel
      .on("broadcast", { event: "*" }, (payload) => messageReceived(payload))
      .subscribe((status) => {
        console.info("status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  function messageReceived(payload) {
    console.log(payload);
  }

  function sendMessage() {
    console.info("send message initiated");
    channel.send({
      type: "broadcast",
      event: "shout",
      payload: {
        message: "hi!",
      },
    });
  }

  return (
    <>
      <h1>Realtime Page</h1>
      <button onClick={sendMessage}>Send Message</button>
    </>
  );
}

export default Realtime;
