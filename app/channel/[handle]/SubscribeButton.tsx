"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  handle: string;
  initialSubscribed: boolean;
  signedIn: boolean;
}

export default function SubscribeButton({ handle, initialSubscribed, signedIn }: Props) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    const method = subscribed ? "DELETE" : "POST";
    await fetch(`/api/channels/${handle}/subscribe`, { method });
    setSubscribed((s) => !s);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      id={`subscribe-btn-${handle}`}
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        subscribed
          ? "border border-white/20 text-white hover:bg-white/10"
          : "bg-white text-black hover:bg-gray-100"
      }`}
    >
      {loading ? "…" : subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
