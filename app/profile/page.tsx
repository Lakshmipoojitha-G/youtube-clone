// app/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Avatar from "@/src/components/atoms/Avatar";
import Button from "@/src/components/atoms/Button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (session?.user?.name) setName(session.user.name);
    fetch("/api/users/profile")
      .then(r => r.json())
      .then(data => {
        if (data?.bio) setBio(data.bio);
        if (data?.website) setWebsite(data.website);
        if (data?.location) setLocation(data.location);
      });
  }, [session, status]);

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

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="flex items-center gap-4 mb-8">
        <Avatar src={session?.user?.image} alt={session?.user?.name ?? "User"} size={72} />
        <div>
          <p className="font-semibold text-lg">{session?.user?.name}</p>
          <p className="text-sm text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {[
          { label: "Display name", id: "profile-name", value: name, set: setName, type: "text" },
          { label: "Bio", id: "profile-bio", value: bio, set: setBio, type: "text" },
          { label: "Website", id: "profile-website", value: website, set: setWebsite, type: "url" },
          { label: "Location", id: "profile-location", value: location, set: setLocation, type: "text" },
        ].map(({ label, id, value, set, type }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              id={id}
              type={type}
              value={value}
              onChange={e => set(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white text-sm placeholder-gray-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        ))}

        <div className="flex items-center gap-4">
          <Button id="profile-save" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {success && <span className="text-green-400 text-sm">✓ Saved!</span>}
        </div>
      </form>
    </div>
  );
}
