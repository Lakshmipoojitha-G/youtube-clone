"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileData {
  bio?: string;
  website?: string;
  location?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [profile, setProfile] = useState<ProfileData>({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/auth/me"), fetch("/api/users/profile")]).then(
      async ([meRes, profileRes]) => {
        if (!meRes.ok) { router.push("/auth/signin"); return; }
        const me: UserInfo = await meRes.json();
        if (!me) { router.push("/auth/signin"); return; }
        setUser(me);
        setName(me.name ?? "");
        if (profileRes.ok) {
          const p: ProfileData = await profileRes.json();
          setProfile(p);
          setBio(p.bio ?? "");
          setWebsite(p.website ?? "");
          setLocation(p.location ?? "");
        }
        setLoading(false);
      }
    );
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, website, location }),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0)?.toUpperCase() ?? "?"
          )}
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {[
          { label: "Display name", id: "profile-name", value: name, set: setName, type: "text", placeholder: "Your name" },
          { label: "Bio", id: "profile-bio", value: bio, set: setBio, type: "text", placeholder: "Tell the world about yourself" },
          { label: "Website", id: "profile-website", value: website, set: setWebsite, type: "url", placeholder: "https://yourwebsite.com" },
          { label: "Location", id: "profile-location", value: location, set: setLocation, type: "text", placeholder: "City, Country" },
        ].map(({ label, id, value, set, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              id={id}
              type={type}
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm placeholder-gray-500 focus:border-red-500 focus:outline-none transition"
            />
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button
            id="profile-save"
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {success && <span className="text-green-400 text-sm">✓ Saved!</span>}
        </div>
      </form>

      <div className="mt-10 border-t border-white/10 pt-6">
        <h2 className="text-lg font-semibold mb-3">Your Channel</h2>
        <Link
          href="/settings/channel"
          id="go-to-channel-settings"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
        >
          Create / manage your channel →
        </Link>
      </div>
    </div>
  );
}
