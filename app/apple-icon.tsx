import { ImageResponse } from "next/server";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          borderRadius: 24,
          color: "white",
          fontSize: 96,
          fontWeight: 800,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
