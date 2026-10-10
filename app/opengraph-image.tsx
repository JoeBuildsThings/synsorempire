import { ImageResponse } from "next/og";

export const alt =
  "Synsorempire, corporate wear, footwear and streetwear in Ibadan, Ogunpa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f3d24",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 200,
            height: 200,
          }}
        >
          <svg width="200" height="200" viewBox="0 0 70 70">
            <polygon
              points="23,5 47,5 65,23 65,47 47,65 23,65 5,47 5,23"
              fill="#fd6cc6"
            />
            <polygon
              points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20"
              fill="#93c554"
            />
            <polygon
              points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22"
              fill="#0f3d24"
            />
          </svg>
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 0,
              top: 0,
              width: 200,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 120,
              fontWeight: 700,
              color: "#93c554",
            }}
          >
            S
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 96,
            fontWeight: 700,
            textShadow: "6px 6px 0 #fd6cc6",
          }}
        >
          Synsorempire
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 36,
            color: "#cfe3d3",
          }}
        >
          Corporate wear, footwear and streetwear
        </div>
        <div
          style={{ display: "flex", marginTop: 34, fontSize: 28, color: "#93c554" }}
        >
          Ibadan, Ogunpa
        </div>
      </div>
    ),
    size
  );
}
