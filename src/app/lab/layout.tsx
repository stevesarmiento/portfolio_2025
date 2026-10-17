import type { ReactNode } from "react";
import "@/components/iso/iso.css";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="iso" data-theme="light">
      {children}
    </div>
  );
}
