import { store } from "@/server/store";
import { getSessionUser } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import SubscribeButton from "./SubscribeButton";

export const dynamic = "force-dynamic";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const channelId = store.channelsByHandle.get(handle);
  const channel = channelId ? store.channels.get(channelId) : null;
  return { title: channel ? `${channel.title} – MyTube` : "Channel – MyTube" };
}

export default async function ChannelPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const channelId = store.channelsByHandle.get(handle);
  if (!channelId) notFound();
  const channel = store.channels.get(channelId)!;

  const subscriberCount = store.subscriptions.filter((s) => s.channelId === channelId).length;
  const owner = store.users.get(channel.ownerId);

  const currentUser = await getSessionUser();
  const isSubscribed = currentUser
    ? store.subscriptions.some(
        (s) => s.subscriberId === currentUser.id && s.channelId === channelId
      )
    : false;
  const isOwner = currentUser?.id === channel.ownerId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Banner */}
      <div
        className="w-full h-40 rounded-2xl mb-6 flex items-end p-6"
        style={{
          background: channel.bannerImage
            ? `url(${channel.bannerImage}) center/cover no-repeat`
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />

      {/* Channel header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 overflow-hidden">
          {channel.avatarImage ? (
            <img src={channel.avatarImage} alt={channel.title} className="w-full h-full object-cover" />
          ) : (
            channel.title.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">{channel.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">@{channel.handle}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatCount(subscriberCount)} subscriber{subscriberCount !== 1 ? "s" : ""}
          </p>
          {channel.description && (
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{channel.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {isOwner ? (
            <Link
              href="/settings/channel"
              id="edit-channel-btn"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Manage channel
            </Link>
          ) : (
            <SubscribeButton
              handle={handle}
              initialSubscribed={isSubscribed}
              signedIn={!!currentUser}
            />
          )}
        </div>
      </div>

      {/* Owner info */}
      {owner && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Channel owner</p>
          <p className="text-white font-medium">{owner.name}</p>
          <p className="text-sm text-gray-400">{owner.email}</p>
        </div>
      )}

      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-lg">No videos uploaded yet</p>
        <p className="text-sm mt-1">Check back later for new content.</p>
      </div>
    </div>
  );
}
