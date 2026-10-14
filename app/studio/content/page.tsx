"use client";
import { Plus } from "lucide-react";
import { useStudio } from "@/components/studio/StudioContext";
import { useStudioData } from "@/components/studio/useStudioData";
import VideoTable from "@/components/studio/VideoTable";

export default function ContentPage() {
  const { videos, reload } = useStudioData(28);
  const { openUpload } = useStudio();
  return (
    <div className="ys-page">
      <div className="ys-page-head">
        <h1 className="ys-h1">Channel content</h1>
        <button className="ys-white-btn" onClick={openUpload}><Plus size={16} /> Upload video</button>
      </div>
      <section className="ys-card"><VideoTable videos={videos} onChanged={reload} /></section>
    </div>
  );
}