import { StudioProvider } from "@/components/studio/StudioContext";
import StudioShell from "@/components/studio/StudioShell";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <StudioShell>{children}</StudioShell>
    </StudioProvider>
  );
}