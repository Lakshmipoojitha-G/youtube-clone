// src/components/atoms/Avatar.tsx
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt = "avatar", size = 36, className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={cn("rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm", className)}
    >
      {alt.charAt(0).toUpperCase()}
    </div>
  );
}
