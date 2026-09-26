import { ImageResponse } from "next/og";
import { getShow } from "@/lib/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Where to watch this classic cartoon legally";

export default async function ShowOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const show = getShow(slug);
  const title = show?.title ?? "Classic cartoon";
  const year = show ? String(show.year) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#16263a",
          color: "#f6efe2",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: "#f3d48a" }}>
          WHERE TO WATCH LEGALLY
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
          {year ? (
            <div style={{ display: "flex", fontSize: 28, color: "#f3d48a" }}>{year}</div>
          ) : null}
          <div style={{ display: "flex", marginTop: 12, fontSize: 64, lineHeight: 1.08 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26 }}>
          Nostalgia Catalog · Official links only. No video is hosted here.
        </div>
      </div>
    ),
    { ...size },
  );
}
