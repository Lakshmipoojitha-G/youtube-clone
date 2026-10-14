"use client";
import { useState } from "react";
import { CATEGORIES, type StudioVideo, type Visibility } from "@/types/studio";

export default function EditVideoModal({
  video, onClose, onSaved,
}: { video: StudioVideo; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [category, setCategory] = useState(video.category);
  const [tags, setTags] = useState(video.tags.join(", "));
  const [visibility, setVisibility] = useState<Visibility>(video.visibility);
  const [thumb, setThumb] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true); setError("");
    const res = await fetch(`/api/studio/videos/${video.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, category, visibility,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (!res.ok) { setSaving(false); return setError("Could not save changes"); }

    if (thumb) {
      const fd = new FormData();
      fd.append("file", thumb);
      const t = await fetch(`/api/studio/videos/${video.id}/thumbnail`, { method: "POST", body: fd });
      if (!t.ok) { setSaving(false); return setError((await t.json()).error ?? "Thumbnail failed"); }
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  const preview = thumb ? URL.createObjectURL(thumb) : video.thumbnailUrl;

  return (
    <div className="modal-overlay">
      <div className="modal-content studio-modal">
        <h2 className="studio-section-title" style={{ marginBottom: 0 }}>Edit video</h2>
        <input className="studio-input" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="studio-input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="studio-row studio-row--2">
          <select className="studio-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="studio-input" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
        <input className="studio-input" placeholder="Tags (comma separated)" value={tags}
          onChange={(e) => setTags(e.target.value)} />

        <div>
          <span className="studio-label">Thumbnail</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview && <img src={preview} alt="" className="studio-preview" />}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="studio-file"
            onChange={(e) => setThumb(e.target.files?.[0] ?? null)} />
        </div>

        {error && <p className="studio-error">{error}</p>}
        <div className="studio-actions">
          <button className="studio-btn" onClick={onClose}>Cancel</button>
          <button className="studio-btn studio-btn--blue" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}