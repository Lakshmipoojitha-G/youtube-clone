import type { Comment, Reaction, Video, WatchProgress } from "@/types/video";
import { SEED_VIDEOS } from "./seed-videos";

// ─── Auth / User types ────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  image?: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  bio: string;
  website: string;
  location: string;
}

export interface Channel {
  id: string;
  handle: string;
  title: string;
  description: string;
  ownerId: string;
  avatarImage?: string;
  bannerImage?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

// In-memory store, survives hot reload. Replace with Prisma once the schema is merged.
interface Store {
  videos: Map<string, Video>;
  comments: Comment[];
  reactions: Map<string, Reaction>; // key: `${userId}:${videoId}`
  commentLikes: Set<string>; // key: `${userId}:${commentId}`
  history: Map<string, WatchProgress>; // key: videoId (single demo user)
  viewKeys: Map<string, number>; // key: `${ip}:${videoId}` -> timestamp (spam guard)
  // Auth / foundation
  users: Map<string, User>; // key: userId
  usersByEmail: Map<string, string>; // email -> userId
  profiles: Map<string, UserProfile>; // key: userId
  channels: Map<string, Channel>; // key: channelId
  channelsByHandle: Map<string, string>; // handle -> channelId
  subscriptions: Subscription[];
  notifications: Notification[];
  sessions: Map<string, string>; // sessionToken -> userId
}

const g = globalThis as unknown as { __m3store?: Store };

// Seed a demo user and channel so pages work without registration
const DEMO_USER_ID = "demo-user";
const DEMO_CHANNEL_ID = "demo-channel";

function makeInitialStore(): Store {
  const demoUser: User = {
    id: DEMO_USER_ID,
    name: "Demo User",
    email: "demo@example.com",
    passwordHash: "demo",
    createdAt: new Date().toISOString(),
  };
  const demoChannel: Channel = {
    id: DEMO_CHANNEL_ID,
    handle: "demo",
    title: "Demo Channel",
    description: "This is the demo channel.",
    ownerId: DEMO_USER_ID,
    createdAt: new Date().toISOString(),
  };

  const users = new Map<string, User>();
  users.set(DEMO_USER_ID, demoUser);

  const usersByEmail = new Map<string, string>();
  usersByEmail.set(demoUser.email, DEMO_USER_ID);

  const channels = new Map<string, Channel>();
  channels.set(DEMO_CHANNEL_ID, demoChannel);

  const channelsByHandle = new Map<string, string>();
  channelsByHandle.set("demo", DEMO_CHANNEL_ID);

  return {
    videos: new Map(SEED_VIDEOS.map((v) => [v.id, { ...v }])),
    comments: [],
    reactions: new Map(),
    commentLikes: new Set(),
    history: new Map(),
    viewKeys: new Map(),
    users,
    usersByEmail,
    profiles: new Map(),
    channels,
    channelsByHandle,
    subscriptions: [],
    notifications: [],
    sessions: new Map(),
  };
}

export const store: Store = g.__m3store ?? (g.__m3store = makeInitialStore());

// Until Member 1's Auth.js is merged, everyone is this demo user.
export const DEMO_USER = DEMO_USER_ID;

// ─── Helper: simple unique ID ─────────────────────────────────────────────────
export function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
