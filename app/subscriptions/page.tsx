// app/subscriptions/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCount } from "@/src/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscriptions – MyTube" };

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const subscriptions = await prisma.subscription.findMany({
    where: { subscriberId: session.user.id },
    include: {
      channel: { include: { subscribedBy: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">You haven't subscribed to any channels yet.</p>
          <Link href="/" className="mt-4 text-red-400 hover:underline">Explore channels</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map(({ channel }: { channel: any }) => (
            <Link
              key={channel.id}
              href={`/channel/${channel.handle}`}
              id={`subscription-${channel.handle}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900 hover:bg-gray-800 transition"
            >
              {channel.avatarImage ? (
                <img src={channel.avatarImage} alt={channel.title} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
                  {channel.title.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{channel.title}</p>
                <p className="text-xs text-gray-400">@{channel.handle}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatCount(channel.subscribedBy.length)} subscribers</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
