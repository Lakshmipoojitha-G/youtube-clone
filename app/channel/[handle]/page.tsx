// app/channel/[handle]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import SubscribeButton from "@/src/components/molecules/SubscribeButton";
import { formatCount } from "@/src/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const channel = await prisma.channel.findUnique({ where: { handle: params.handle } });
  if (!channel) return { title: "Channel not found" };
  return { title: `${channel.title} – MyTube`, description: channel.description ?? "" };
}

export default async function ChannelPage({ params }: { params: { handle: string } }) {
  const session = await getServerSession(authOptions);

  const channel = await prisma.channel.findUnique({
    where: { handle: params.handle },
    include: {
      owner: { select: { name: true, image: true } },
      subscribedBy: true,
    },
  });
  if (!channel) notFound();

  const subscriberCount = channel.subscribedBy.length;
  const isSubscribed = session?.user?.id
    ? channel.subscribedBy.some((s: { subscriberId: string }) => s.subscriberId === session.user.id)
    : false;
  const isOwner = session?.user?.id === channel.ownerId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="w-full h-36 rounded-2xl bg-gradient-to-r from-red-900 via-red-700 to-orange-600 mb-6 overflow-hidden">
        {channel.bannerImage && (
          <img src={channel.bannerImage} alt="Channel banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Channel info */}
      <div className="flex items-start gap-5">
        {channel.avatarImage ? (
          <img src={channel.avatarImage} alt={channel.title} className="w-20 h-20 rounded-full object-cover border-2 border-gray-700" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-gray-700">
            {channel.title.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{channel.title}</h1>
          <p className="text-gray-400 text-sm mt-0.5">@{channel.handle} · {formatCount(subscriberCount)} subscribers</p>
          {channel.description && <p className="text-gray-300 text-sm mt-2 max-w-2xl">{channel.description}</p>}
          <div className="mt-3 flex items-center gap-3">
            {isOwner ? (
              <a href="/settings/channel" className="rounded-full bg-gray-700 px-4 py-1.5 text-sm font-semibold hover:bg-gray-600 transition">
                Customize channel
              </a>
            ) : (
              <SubscribeButton
                handle={params.handle}
                initialSubscribed={isSubscribed}
                subscriberCount={subscriberCount}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs placeholder for videos (Member 2 will populate) */}
      <div className="mt-8 border-b border-gray-800">
        <nav className="flex gap-6 text-sm font-semibold">
          <button className="pb-2 border-b-2 border-white text-white">Videos</button>
          <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-white">Playlists</button>
          <button className="pb-2 border-b-2 border-transparent text-gray-400 hover:text-white">About</button>
        </nav>
      </div>

      <div className="mt-6 text-gray-500 text-sm">
        No videos yet – upload your first video from the Studio.
      </div>
    </div>
  );
}
