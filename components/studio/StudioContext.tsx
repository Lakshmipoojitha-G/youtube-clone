"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";
import UploadForm from "./UploadForm";

type Ctx = { refreshKey: number; refresh: () => void; openUpload: () => void };
const StudioCtx = createContext<Ctx | null>(null);

export function useStudio() {
  const c = useContext(StudioCtx);
  if (!c) throw new Error("useStudio must be used inside StudioProvider");
  return c;
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const value = useMemo(() => ({ refreshKey, refresh, openUpload: () => setUploadOpen(true) }), [refreshKey, refresh]);

  return (
    <StudioCtx.Provider value={value}>
      {children}
      {uploadOpen && (
        <div className="modal-overlay ys-top">
          <div className="modal-content ys-upload-modal">
            <button className="ys-modal-close" onClick={() => setUploadOpen(false)} aria-label="Close"><X size={20} /></button>
            <UploadForm onDone={() => { setUploadOpen(false); refresh(); }} />
          </div>
        </div>
      )}
    </StudioCtx.Provider>
  );
}