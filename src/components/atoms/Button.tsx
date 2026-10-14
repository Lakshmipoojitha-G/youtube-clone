// src/components/atoms/Button.tsx
import { Button as ShadcnButton } from "@/components/ui/button";

export default function Button({ children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnButton>) {
  return <ShadcnButton {...props}>{children}</ShadcnButton>;
}
