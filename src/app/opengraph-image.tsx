import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "SEN — A global network of student builders.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const EYEBROW = "BORN IN SAN DIEGO";
const WORDMARK = "SEN";
const TAGLINE = "A global network of student builders.";

// Pull a single weight from Google Fonts as TTF so satori (the renderer
// behind next/og) can use it. Passing `text=` makes Google return only the
// glyphs we need, which keeps the request small and ensures a TTF response.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+"
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url).then((r) => r.text());
  const match = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (!match) {
    throw new Error(`Failed to extract font URL for ${family} ${weight}`);
  }
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) {
    throw new Error(
      `Failed to fetch ${family} ${weight}: HTTP ${fontRes.status}`
    );
  }
  return fontRes.arrayBuffer();
}

export default async function Image() {
  const [logo, newsreader500, manrope500, manrope400] = await Promise.all([
    readFile(join(process.cwd(), "public/SEN_Logo_cropped.png")),
    loadGoogleFont("Newsreader", 500, WORDMARK),
    loadGoogleFont("Manrope", 500, EYEBROW),
    loadGoogleFont("Manrope", 400, TAGLINE),
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
