import type { ProcessingStatus } from "@/types/studio";

export default function StatusBadge({ status }: { status: ProcessingStatus }) {
  return <span className={`studio-badge studio-badge--${status}`}>{status}</span>;
}