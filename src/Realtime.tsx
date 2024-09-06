import { supabase } from "./utils/supabaseClient";

function Realtime() {
  const roomOne = supabase.channel("room-one", {
    config: {
      broadcast: { self: true },
    },
  });

  roomOne
    .on("broadcast", { event: "test" }, (payload) => {
      console.log(payload);
    })
    .subscribe();

  function handleClick() {
    console.log("trying to send a message");
    roomOne.send({
      type: "broadcast",
      event: "test",
      payload: { message: "hello, world" },
    });
  }

  return (
    <>
      <button onClick={handleClick}>send message</button>
    </>
  );
}

export default Realtime;
