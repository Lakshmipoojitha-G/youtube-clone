"use client";
import { useState } from "react";
import { Globe, Link2, Lock, Pencil, Trash2 } from "lucide-react";
import type { StudioVideo } from "@/types/studio";
import StatusBadge from "./StatusBadge";
import EditVideoModal from "./EditVideoModal";
import { formatDuration } from "./format";

const VIS_ICON = { public: Globe, unlisted: Link2, private: Lock };

export default function VideoTable({
  videos, onChanged, limit,
}: { videos: StudioVideo[]; onChanged: () => void; limit?: number }) {
  const [editing, setEditing] = useState<StudioVideo | null>(null);
  const rows = limit ? videos.slice(0, limit) : videos;

  async function remove(id: string) {
    if (!confirm("Delete this video permanently?")) return;
    await fetch(`/api/studio/videos/${id}`, { method: "DELETE" });
    onChanged();
  }

  async function setVisibility(id: string, visibility: string) {
    await fetch(`/api/studio/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    onChanged();
  }

  if (!rows.length) return <p className="ys-empty">No videos yet. Click Create to upload your first one.</p>;

  return (
    <>
      <div className="ys-table-wrap">
        <table className="ys-table">
          <thead>
            <tr>
              <th>Video</th><th>Visibility</th><th>Status</th><th>Date</th>
              <th className="ys-num">Views</th><th />
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => {
              const Icon = VIS_ICON[v.visibility];
              return (
                <tr key={v.id}>
                  <td>
                    <div className="ys-vcell">
                      <div className="ys-vthumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {v.thumbnailUrl && <img src={v.thumbnailUrl} alt="" />}
                        {v.durationSec ? <span className="ys-dur">{formatDuration(v.durationSec)}</span> : null}
                      </div>
                      <div className="ys-vtext">
                        <p className="ys-vtitle">{v.title}</p>
                        <p className="ys-vdesc">{v.description || "No description"}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ys-vis">
                      <Icon size={16} color={v.visibility === "public" ? "#2ba640" : "#aaa"} />
                      <select className="ys-select" value={v.visibility} onChange={(e) => setVisibility(v.id, e.target.value)}>
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>
                    <p>{new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <p className="ys-muted">{v.status === "ready" ? "Published" : "Uploaded"}</p>
                  </td>
                  <td className="ys-num">{v.views.toLocaleString()}</td>
                  <td>
                    <div className="ys-row-actions">
                      <button className="ys-icon-btn" title="Edit" onClick={() => setEditing(v)}><Pencil size={18} /></button>
                      <button className="ys-icon-btn" title="Delete" onClick={() => remove(v.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editing && <EditVideoModal video={editing} onClose={() => setEditing(null)} onSaved={onChanged} />}
    </>
  );
}