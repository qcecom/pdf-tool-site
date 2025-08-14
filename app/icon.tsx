import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          borderRadius: 12,
          color: "white",
          fontSize: 42,
          fontWeight: 700,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        {siteConfig.name?.[0] ?? "N"}
      </div>
    ),
    { ...size }
  );
}
