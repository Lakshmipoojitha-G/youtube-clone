"use client";
import { useState } from "react";
import { CATEGORIES, type Visibility } from "@/types/studio";

export default function UploadForm({ onDone }: { onDone: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string>("Entertainment");
    const [tags, setTags] = useState("");
    const [visibility, setVisibility] = useState<Visibility>("private");
    const [progress, setProgress] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return setError("Choose a video file");
        setBusy(true); setError(""); setProgress(0);
        try {
            const res = await fetch("/api/studio/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title, description, category, visibility,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(typeof data.error === "string" ? data.error : "Could not start upload");
            }
            const { uploadUrl } = await res.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("PUT", uploadUrl);
                xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(Math.round((ev.loaded / ev.total) * 100));
                xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
                xhr.onerror = () => reject(new Error("Network error"));
                xhr.send(file);
            });

            setFile(null); setTitle(""); setDescription(""); setTags("");
            onDone();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className="studio-card studio-form">
            <h2 className="studio-section-title" style={{ marginBottom: 0 }}>Upload video</h2>
            <input type="file" accept="video/*" className="studio-file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <input className="studio-input" placeholder="Title (required)" value={title} maxLength={100}
                onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="studio-input" rows={3} placeholder="Description" value={description}
                onChange={(e) => setDescription(e.target.value)} />
            <div className="studio-row">
                <select className="studio-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="studio-input" placeholder="Tags: react, nextjs" value={tags}
                    onChange={(e) => setTags(e.target.value)} />
                <select className="studio-input" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                </select>
            </div>
            {busy && (
                <div className="studio-progress">
                    <div className="studio-progress-bar" style={{ width: `${progress}%` }} />
                </div>
            )}
            {error && <p className="studio-error">{error}</p>}
            <button disabled={busy} className="studio-btn studio-btn--primary">
                {busy ? `Uploading ${progress}%` : "Upload"}
            </button>
        </form>
    );
}