import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "SEN — A global network of student builders.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const EYEBROW = "BORN IN SAN DIEGO";
const WORDMARK = "SEN";
const TAGLINE = "A global network of student builders.";

// Brand fonts are bundled at assets/fonts/. Reading from disk at build time
// instead of fetching from Google Fonts: the Vercel build worker has flaky
// outbound network and was timing out on fonts.googleapis.com, which broke
// the static OG generation. The TTFs are subsetted to just the glyphs we
// render so they stay small (~15-20KB each).
async function loadBundledFont(filename: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), "assets/fonts", filename));
  // readFile returns Buffer; ImageResponse wants ArrayBuffer
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function Image() {
  const [logo, newsreader500, manrope500, manrope400] = await Promise.all([
    readFile(join(process.cwd(), "public/SEN_Logo_cropped.png")),
    loadBundledFont("Newsreader-Medium.ttf"),
    loadBundledFont("Manrope-Medium.ttf"),
    loadBundledFont("Manrope-Regular.ttf"),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050816",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          padding: "0 96px",
          fontFamily: "Newsreader, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 65% 80% at 28% 50%, rgba(212,168,67,0.20) 0%, rgba(212,168,67,0.06) 35%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(212,168,67,0.22)",
            margin: 28,
            borderRadius: 8,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 72,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 320,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: 9999,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(232,201,122,0.30) 0%, rgba(212,168,67,0.10) 45%, transparent 70%)",
              }}
            />
            <img
              src={logoSrc}
              width={320}
              height={320}
              style={{ borderRadius: 9999, objectFit: "cover" }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}
          >
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 500,
                fontSize: 22,
                color: "rgba(232, 201, 122, 0.92)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              {EYEBROW}
            </div>
            <div
              style={{
                fontFamily: "Newsreader, serif",
                fontWeight: 500,
                fontSize: 124,
                color: "#F0ECE4",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginTop: 24,
              }}
            >
              {WORDMARK}
            </div>
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 400,
                fontSize: 34,
                color: "rgba(240, 236, 228, 0.72)",
                lineHeight: 1.25,
                marginTop: 28,
              }}
            >
              {TAGLINE}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: newsreader500,
          weight: 500,
          style: "normal",
        },
        {
          name: "Manrope",
          data: manrope500,
          weight: 500,
          style: "normal",
        },
        {
          name: "Manrope",
          data: manrope400,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
