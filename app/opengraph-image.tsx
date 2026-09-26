import { ImageResponse } from "next/og";

export const alt = "Nostalgia Catalog — where to watch classic cartoons legally";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          LEGAL WATCH GUIDE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05 }}>Nostalgia Catalog</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, lineHeight: 1.3 }}>
            Where to watch classic cartoons legally
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#f3d48a" }}>
          Official links only. No video is hosted here.
        </div>
      </div>
    ),
    { ...size },
  );
}
