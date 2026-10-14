import { store } from "@/server/store";
import { getSessionUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscriptions – MyTube" };

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default async function SubscriptionsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/auth/signin");

  const userSubs = store.subscriptions.filter((s) => s.subscriberId === userId);

  const subscriptions = userSubs
    .map((s) => {
      const channel = store.channels.get(s.channelId);
      if (!channel) return null;
      const subCount = store.subscriptions.filter((x) => x.channelId === s.channelId).length;
      return { channel, subCount, subscribedAt: s.createdAt };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.subscribedAt).getTime() - new Date(a!.subscribedAt).getTime()) as {
    channel: (typeof store.channels extends Map<string, infer V> ? V : never);
    subCount: number;
    subscribedAt: string;
  }[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-lg">You haven&apos;t subscribed to any channels yet.</p>
          <Link href="/" className="mt-4 text-red-400 hover:underline">
            Explore channels
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map(({ channel, subCount }) => (
            <Link
              key={channel.id}
              href={`/channel/${channel.handle}`}
              id={`subscription-${channel.handle}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 overflow-hidden">
                {channel.avatarImage ? (
                  <img src={channel.avatarImage} alt={channel.title} className="w-full h-full object-cover" />
                ) : (
                  channel.title.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{channel.title}</p>
                <p className="text-xs text-gray-400">@{channel.handle}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatCount(subCount)} subscribers</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
