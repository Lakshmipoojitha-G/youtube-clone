// Seeds fake users, channels, videos, comments and reactions so every member
// can build against realistic data. Run with: npm run db:seed
import { PrismaClient, ReactionType, VideoStatus, Visibility } from "@prisma/client";

const prisma = new PrismaClient();

const BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

const SAMPLE_VIDEOS = [
  { title: "Big Buck Bunny", file: "BigBuckBunny.mp4", thumb: "BigBuckBunny.jpg", category: "Animation", views: 15230 },
  { title: "Elephants Dream", file: "ElephantsDream.mp4", thumb: "ElephantsDream.jpg", category: "Animation", views: 8120 },
  { title: "Sintel", file: "Sintel.mp4", thumb: "Sintel.jpg", category: "Animation", views: 22010 },
  { title: "Tears of Steel", file: "TearsOfSteel.mp4", thumb: "TearsOfSteel.jpg", category: "Sci-Fi", views: 5400 },
  { title: "For Bigger Blazes", file: "ForBiggerBlazes.mp4", thumb: "ForBiggerBlazes.jpg", category: "Entertainment", views: 980 },
];

async function main() {
  const users = await Promise.all(
    ["alice", "bob", "carol"].map((name) =>
      prisma.user.upsert({
        where: { email: `${name}@example.com` },
        update: {},
        create: { name, email: `${name}@example.com` },
      })
    )
  );
  const [alice, bob, carol] = users;

  const channel = await prisma.channel.upsert({
    where: { handle: "blender" },
    update: {},
    create: {
      handle: "blender",
      title: "Blender Foundation",
      description: "Open movies made with Blender.",
      ownerId: alice.id,
    },
  });

  await prisma.subscription.upsert({
    where: { subscriberId_channelId: { subscriberId: bob.id, channelId: channel.id } },
    update: {},
    create: { subscriberId: bob.id, channelId: channel.id },
  });

  const videos = [];
  for (const v of SAMPLE_VIDEOS) {
    const videoUrl = `${BASE}/${v.file}`;
    const existing = await prisma.video.findFirst({ where: { videoUrl } });
    videos.push(
      existing ??
        (await prisma.video.create({
          data: {
            title: v.title,
            description: `${v.title} - sample video used for development.`,
            videoUrl,
            thumbnailUrl: `${BASE}/images/${v.thumb}`,
            category: v.category,
            tags: ["sample", v.category.toLowerCase()],
            views: v.views,
            status: VideoStatus.READY,
            visibility: Visibility.PUBLIC,
            channelId: channel.id,
          },
        }))
    );
  }

  const first = videos[0];
  if ((await prisma.comment.count({ where: { videoId: first.id } })) === 0) {
    const top = await prisma.comment.create({
      data: { text: "Classic! Still love this one.", videoId: first.id, userId: bob.id },
    });
    await prisma.comment.create({
      data: { text: "Same here.", videoId: first.id, userId: carol.id, parentId: top.id },
    });
    await prisma.commentLike.create({ data: { userId: carol.id, commentId: top.id } });
  }

  for (const [i, user] of [bob, carol].entries()) {
    await prisma.videoReaction.upsert({
      where: { userId_videoId: { userId: user.id, videoId: first.id } },
      update: {},
      create: { userId: user.id, videoId: first.id, type: i === 0 ? ReactionType.LIKE : ReactionType.DISLIKE },
    });
  }

  await prisma.watchHistory.upsert({
    where: { userId_videoId: { userId: bob.id, videoId: first.id } },
    update: {},
    create: { userId: bob.id, videoId: first.id, progress: 42 },
  });

  const playlist = await prisma.playlist.findFirst({ where: { ownerId: bob.id, title: "Favorites" } });
  if (!playlist) {
    await prisma.playlist.create({
      data: {
        title: "Favorites",
        ownerId: bob.id,
        visibility: Visibility.PUBLIC,
        items: { create: videos.slice(0, 3).map((v, position) => ({ videoId: v.id, position })) },
      },
    });
  }

  console.log(`Seeded ${users.length} users, 1 channel, ${videos.length} videos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
