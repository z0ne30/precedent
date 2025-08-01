/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Enyu Rao";
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontFamily: "serif",
              color: "#374151",
              lineHeight: "1.4",
              letterSpacing: "-0.01em",
              marginTop: "8px",
            }}
          >
            Enyu Rao
          </div>
          <div
            style={{
              fontSize: "48px",
              fontFamily: "serif",
              color: "#374151",
              lineHeight: "1.4",
              letterSpacing: "-0.01em",
            }}
          >
            magician @ orbit
          </div>
          <div
            style={{
              fontSize: "48px",
              fontFamily: "serif",
              color: "#374151",
              lineHeight: "1.4",
              letterSpacing: "-0.01em",
              marginTop: "8px",
            }}
          >
            chaser of uphill problems
          </div>
          <div
            style={{
              fontSize: "48px",
              fontFamily: "serif",
              color: "#374151",
              lineHeight: "1.4",
              letterSpacing: "-0.01em",
              marginTop: "8px",
            }}
          >
            el padrón of launch yard
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
