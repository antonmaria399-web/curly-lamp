import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#C8FF3D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, fontWeight: 900, color: "#0A0B0A" }}>B</div>
    ),
    size,
  );
}
