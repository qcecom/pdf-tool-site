import { ImageResponse } from "next/server";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Frame({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
        color: "white",
        padding: 64,
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.8 }}>{siteConfig.name}</div>
      <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
      <div style={{ fontSize: 30, opacity: 0.9 }}>{subtitle}</div>
    </div>
  );
}

export default function OG() {
  return new ImageResponse(
    <Frame title="Secure file tools" subtitle="No storage • HTTPS • Auto-delete" />,
    { ...size }
  );
}
