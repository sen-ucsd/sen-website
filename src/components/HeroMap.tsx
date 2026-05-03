"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Delaunay } from "d3-delaunay";
import { CHAPTERS, project } from "@/data/chapters";
import {
  WORLD_SVG_PATH,
  WORLD_SVG_VIEWBOX,
  WORLD_SVG_W,
  WORLD_SVG_H,
} from "@/data/world-svg";

/**
 * Hero map animation.
 *
 * Sequence:
 *   0.0s  San Diego dot fades in and pulses, world map outline barely visible
 *   1.6s  Camera "pulls back" (we just zoom the SVG out from focused-on-SD to full world)
 *         while U.S. dots ignite one by one with hairline lines drawing between them
 *   3.8s  Global dots ignite across continents with more lines
 *   5.5s+ Ambient state — dots pulse softly, occasional new line draws
 */
// Equirectangular projection puts the world's geographic center (longitude 0)
// at SVG x = 500. We want America (~longitude -100) at the visible center,
// so we shift the camera right by ~278 SVG units when it lands in world view.
const AMERICA_OFFSET_X = 278;

// Tile the world content at -W, 0, +W so panning never exposes empty edges
// and the loop wraps seamlessly: the +W copy becomes visible on the right
// just as the original copy exits on the left, and they're identical.
const TILE_OFFSETS = [-WORLD_SVG_W, 0, WORLD_SVG_W];

export function HeroMap() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"sd" | "us" | "world">("sd");

  useEffect(() => {
    if (reduce) {
      setStage("world");
      return;
    }
    const t1 = setTimeout(() => setStage("us"), 1600);
    const t2 = setTimeout(() => setStage("world"), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  // Project chapters into the same viewBox as the world SVG path
  const projected = useMemo(
    () =>
      CHAPTERS.map((c) => {
        const { x, y } = project(c.lng, c.lat);
        return { ...c, px: x * WORLD_SVG_W, py: y * WORLD_SVG_H };
      }),
    []
  );

  const sd = projected.find((c) => c.id === "san-diego")!;

  // Lines: connect every node to its geographic neighbors using Delaunay triangulation.
  // To capture adjacencies across the antimeridian (e.g. California ↔ Tokyo, which
  // are far apart on the flat map but neighbors across the Pacific), we run Delaunay
  // on the chapter set tiled three times — the original plus copies shifted by ±W.
  // Each unordered chapter pair keeps its shortest representation, so wrapped pairs
  // are drawn via the shifted copy with line endpoints that may sit outside [0, W].
  // Tiling at render time then makes the line appear continuously across the wrap.
  const lines = useMemo(() => {
    const N = projected.length;
    const augPoints: [number, number][] = [];
    for (const c of projected) augPoints.push([c.px, c.py]);
    for (const c of projected) augPoints.push([c.px - WORLD_SVG_W, c.py]);
    for (const c of projected) augPoints.push([c.px + WORLD_SVG_W, c.py]);

    const delaunay = Delaunay.from(augPoints);
    const { triangles } = delaunay;

    type Edge = {
      from: (typeof projected)[number];
      to: (typeof projected)[number];
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      key: string;
      isUS: boolean;
      dist2: number;
    };
    const seen = new Map<string, Edge>();

    for (let t = 0; t < triangles.length; t += 3) {
      const tri = [triangles[t], triangles[t + 1], triangles[t + 2]];
      for (let k = 0; k < 3; k++) {
        const ai = tri[k];
        const bi = tri[(k + 1) % 3];
        // At least one endpoint must be in the central (real) copy, otherwise
        // we'd just be re-deriving the same edge from a non-central tile.
        if (ai >= N && bi >= N) continue;
        const aIdx = ai % N;
        const bIdx = bi % N;
        if (aIdx === bIdx) continue;
        const lo = Math.min(aIdx, bIdx);
        const hi = Math.max(aIdx, bIdx);
        const key = `${lo}|${hi}`;
        const aPos = augPoints[ai];
        const bPos = augPoints[bi];
        const dx = aPos[0] - bPos[0];
        const dy = aPos[1] - bPos[1];
        const dist2 = dx * dx + dy * dy;
        const existing = seen.get(key);
        if (existing && existing.dist2 <= dist2) continue;
        seen.set(key, {
          from: projected[aIdx],
          to: projected[bIdx],
          x1: aPos[0],
          y1: aPos[1],
          x2: bPos[0],
          y2: bPos[1],
          key,
          isUS: isInUS(projected[aIdx]) && isInUS(projected[bIdx]),
          dist2,
        });
      }
    }
    return Array.from(seen.values());
  }, [projected]);

  // Camera pull-back: zoom in on San Diego at start, full world at end.
  // We do this by transforming the inner <g> with a scale + translate.
  // SD is at sd.px, sd.py; we want it centered, scaled ~3.2x.
  const sdScale = 3.2;
  const sdTx = WORLD_SVG_W / 2 - sd.px * sdScale;
  const sdTy = WORLD_SVG_H / 2 - sd.py * sdScale;

  const panActive = stage === "world" && !reduce;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Soft gold glow behind map */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(212,168,67,0.06) 0%, transparent 60%), radial-gradient(circle at 30% 40%, rgba(20,27,45,0.6) 0%, transparent 50%)",
        }}
      />

      <svg
        viewBox={WORLD_SVG_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="dotHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8C97A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4A843" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dotHaloFounding" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE7A8" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#E8C97A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A07C2E" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4A843" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#A07C2E" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g
          initial={
            reduce
              ? { transform: "translate(0px,0px) scale(1)" }
              : { transform: `translate(${sdTx}px,${sdTy}px) scale(${sdScale})` }
          }
          animate={{
            transform:
              stage === "sd"
                ? `translate(${sdTx}px,${sdTy}px) scale(${sdScale})`
                : `translate(${AMERICA_OFFSET_X}px,0px) scale(1)`,
          }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Continuous eastward world tour. The map is tiled three times
              horizontally, so animating the inner group from x=0 to x=-W
              wraps seamlessly: the moment the original copy exits left, the
              +W tile (an identical copy) is in the same screen position. */}
          <motion.g
            animate={{
              x: panActive ? -WORLD_SVG_W : 0,
            }}
            transition={{
              x: panActive
                ? {
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.2,
                  }
                : { duration: 0 },
            }}
          >
          {TILE_OFFSETS.map((tx) => (
            <g key={tx} transform={`translate(${tx},0)`}>
              {/* World map outline */}
              <motion.path
                d={WORLD_SVG_PATH}
                fill="rgba(212,168,67,0.04)"
                stroke="rgba(212,168,67,0.18)"
                strokeWidth={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === "sd" ? 0.35 : 0.7 }}
                transition={{ duration: 2 }}
                vectorEffect="non-scaling-stroke"
              />

              {/* Network lines — Delaunay adjacency. Continuous strokes, no dashes. */}
              <g>
                {lines.map((l, i) => {
                  const stageReady =
                    stage === "world" || (stage === "us" && l.isUS);
                  return (
                    <motion.line
                      key={`${tx}_${l.key}`}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="#E8C97A"
                      strokeWidth={0.9}
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: stageReady ? 0.7 : 0 }}
                      transition={{
                        duration: 0.6,
                        delay: stageReady ? (i % 10) * 0.06 : 0,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </g>

              {/* Chapter dots — appear in sync with the lines that connect them */}
              <g>
                {projected.map((c, i) => {
                  const isFounding = c.status === "founding";
                  const isUS = isInUS(c);
                  const visible =
                    stage === "world" ||
                    (stage === "us" && isUS) ||
                    isFounding;
                  const dotR = isFounding ? 4 : 2.4;
                  const haloR = isFounding ? 22 : 12;
                  return (
                    <motion.g
                      key={`${tx}_${c.id}`}
                      initial={{ opacity: isFounding ? 1 : 0 }}
                      animate={{ opacity: visible ? 1 : 0 }}
                      transition={{
                        duration: 0.6,
                        delay:
                          visible && !isFounding ? (i % 10) * 0.06 : 0,
                        ease: "easeOut",
                      }}
                    >
                      {/* Halo */}
                      <motion.circle
                        cx={c.px}
                        cy={c.py}
                        r={haloR}
                        fill={
                          isFounding ? "url(#dotHaloFounding)" : "url(#dotHalo)"
                        }
                        style={{
                          transformOrigin: `${c.px}px ${c.py}px`,
                          transformBox: "fill-box",
                        }}
                        animate={
                          reduce
                            ? undefined
                            : {
                                opacity: isFounding ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4],
                                scale: isFounding ? [1, 1.25, 1] : [1, 1.12, 1],
                              }
                        }
                        transition={{
                          duration: isFounding ? 2.4 : 3 + (c.lng + 180) % 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Dot */}
                      <circle
                        cx={c.px}
                        cy={c.py}
                        r={dotR}
                        fill={isFounding ? "#FFE7A8" : "#D4A843"}
                      />
                    </motion.g>
                  );
                })}
              </g>
            </g>
          ))}
          </motion.g>
        </motion.g>
      </svg>

      {/* Founding chapter label, anchored to SD position via a small overlay */}
      <FoundingLabel stage={stage} sdPx={sd.px} sdPy={sd.py} />

      {/* Vignette fade to background at top + bottom edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #050816 0%, transparent 18%, transparent 65%, #050816 100%)",
        }}
      />
    </div>
  );
}

function isInUS(c: { country: string }) {
  return c.country === "USA";
}

function FoundingLabel({
  stage,
  sdPx,
  sdPy,
}: {
  stage: "sd" | "us" | "world";
  sdPx: number;
  sdPy: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: string; top: string }>({
    left: "50%",
    top: "50%",
  });

  // Convert SVG coords -> screen percentage (since SVG is xMidYMid slice we use approximate)
  useEffect(() => {
    function update() {
      const el = ref.current?.parentElement;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      // The SVG is sliced (cover), so we project SVG x,y -> screen with the same logic
      const aspectSvg = WORLD_SVG_W / WORLD_SVG_H; // 2
      const aspectEl = w / h;
      let scale: number, offX: number, offY: number;
      if (aspectEl > aspectSvg) {
        scale = w / WORLD_SVG_W;
        offX = 0;
        offY = (h - WORLD_SVG_H * scale) / 2;
      } else {
        scale = h / WORLD_SVG_H;
        offX = (w - WORLD_SVG_W * scale) / 2;
        offY = 0;
      }
      const screenX = sdPx * scale + offX;
      const screenY = sdPy * scale + offY;
      setPos({ left: `${(screenX / w) * 100}%`, top: `${(screenY / h) * 100}%` });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [sdPx, sdPy]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.left, top: pos.top }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "sd" ? 1 : stage === "us" ? 0.2 : 0 }}
        transition={{ duration: 1, delay: stage === "sd" ? 0.6 : 0 }}
      >
        <div
          className="text-eyebrow text-cream-60 whitespace-nowrap"
          style={{
            transform: "translate(28px, -22px)",
            color: "rgba(232, 201, 122, 0.85)",
          }}
        >
          San Diego · Founding Chapter
        </div>
      </motion.div>
    </div>
  );
}
