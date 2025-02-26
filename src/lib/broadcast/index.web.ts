import Stub from "@/lib/broadcast/stub";

const Broadcast =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? window.BroadcastChannel
    : Stub;

export default Broadcast;
