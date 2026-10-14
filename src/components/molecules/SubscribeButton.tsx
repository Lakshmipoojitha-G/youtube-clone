// src/components/molecules/SubscribeButton.tsx
"use client";
import { useState } from "react";
import Button from "@/src/components/atoms/Button";
import { formatCount } from "@/src/lib/utils";

interface Props {
  handle: string;
  initialSubscribed: boolean;
  subscriberCount: number;
}

export default function SubscribeButton({ handle, initialSubscribed, subscriberCount }: Props) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [count, setCount] = useState(subscriberCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const method = subscribed ? "DELETE" : "POST";
    const res = await fetch(`/api/channels/${handle}/subscribe`, { method });
    if (res.ok) {
      setSubscribed(v => !v);
      setCount(c => (subscribed ? c - 1 : c + 1));
    }
    setLoading(false);
  }

  return (
    <Button
      id="subscribe-btn"
      variant={subscribed ? "secondary" : "primary"}
      onClick={toggle}
      disabled={loading}
    >
      {subscribed ? `Subscribed · ${formatCount(count)}` : `Subscribe · ${formatCount(count)}`}
    </Button>
  );
}
