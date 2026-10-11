import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <svg width="192" height="192" viewBox="0 0 64 64">
          <polygon
            points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20"
            fill="#93c554"
          />
          <path d="M18 16H46V24H26V28H46V48H18V40H38V36H18Z" fill="#0f3d24" />
        </svg>
      </div>
    ),
    size
  );
}
