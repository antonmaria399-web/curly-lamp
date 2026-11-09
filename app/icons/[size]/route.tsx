import { ImageResponse } from "next/og";

/** PWA icons (192 / 512) made from the logo. */
export async function GET(_: Request, ctx: RouteContext<"/icons/[size]">) {
  const { size } = await ctx.params;
  const s = size === "512" ? 512 : 192;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#C8FF3D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.62, fontWeight: 900, color: "#0A0B0A" }}>B</div>
    ),
    { width: s, height: s },
  );
}
