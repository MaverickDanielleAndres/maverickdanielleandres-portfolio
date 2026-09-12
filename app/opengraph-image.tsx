import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Maverick Danielle Andres | Full-Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const imagePath = path.join(process.cwd(), "public", "updatedprofile_pic.png");
  let base64Image = "";
  try {
    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath);
      base64Image = `data:image/png;base64,${buffer.toString("base64")}`;
    } else {
      const webpPath = path.join(process.cwd(), "public", "updatedprofile_pic.webp");
      const buffer = fs.readFileSync(webpPath);
      base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
    }
  } catch {
    base64Image = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#111111",
          backgroundImage:
            "radial-gradient(circle at 82% 48%, rgba(96, 85, 240, 0.22) 0%, rgba(17, 17, 17, 0) 65%)",
          padding: "50px 70px",
          fontFamily: "sans-serif",
          color: "#F0F0F0",
        }}
      >
        {/* Left Column: Branding, Name, Role & Domain */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "620px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "15px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#888888",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: "#6055F0",
              }}
            />
            Portfolio
          </div>

          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              lineHeight: 1.12,
              color: "#FFFFFF",
              letterSpacing: "-0.025em",
              marginBottom: "16px",
            }}
          >
            Maverick Danielle Andres
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 500,
              color: "#6055F0",
              marginBottom: "32px",
              letterSpacing: "-0.01em",
            }}
          >
            Full-Stack Developer
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 24px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.14)",
                backgroundColor: "rgba(255,255,255,0.04)",
                fontSize: "18px",
                fontWeight: 500,
                color: "#E0E0E0",
                letterSpacing: "0.02em",
              }}
            >
              mavs.is-a.dev
            </div>
          </div>
        </div>

        {/* Right Column: Frame containing Maverick's full portrait with head completely intact */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "380px",
            height: "460px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "#161616",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          {base64Image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={base64Image}
              alt="Maverick Danielle Andres"
              style={{
                width: "380px",
                height: "460px",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
