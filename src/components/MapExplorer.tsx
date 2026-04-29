"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CHAPTERS, project } from "@/data/chapters";
import {
  WORLD_SVG_PATH,
  WORLD_SVG_W,
  WORLD_SVG_H,
} from "@/data/world-svg";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.5;

export function MapExplorer({ open, onClose }: Props) {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; basePanX: number; basePanY: number } | null>(null);
  const pinchRef = useRef<{ baseDist: number; baseZoom: number } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setQuery("");
      setHoveredId(null);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const projected = useMemo(
    () =>
      CHAPTERS.map((c) => {
        const { x, y } = project(c.lng, c.lat);
        return { ...c, px: x * WORLD_SVG_W, py: y * WORLD_SVG_H };
      }),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projected;
    return projected.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        (c.university ?? "").toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [projected, query]);

  // Derive viewBox from zoom + pan around the center
  const viewBox = useMemo(() => {
    const w = WORLD_SVG_W / zoom;
    const h = WORLD_SVG_H / zoom;
    // pan is in SVG units (offsets from center)
    const x = (WORLD_SVG_W - w) / 2 + pan.x;
    const y = (WORLD_SVG_H - h) / 2 + pan.y;
    return `${x} ${y} ${w} ${h}`;
  }, [zoom, pan]);

  // Wheel zoom
  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    setZoom((z) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * (1 + delta)))
    );
  }

  // Drag pan + pinch zoom (multi-touch)
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // Start pinch
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinchRef.current = { baseDist: Math.hypot(dx, dy), baseZoom: zoom };
      dragRef.current = null;
    } else if (pointers.current.size === 1) {
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        basePanX: pan.x,
        basePanY: pan.y,
      };
    }
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (pinchRef.current && pointers.current.size >= 2) {
      const pts = Array.from(pointers.current.values()).slice(0, 2);
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchRef.current.baseDist;
      const next = pinchRef.current.baseZoom * ratio;
      setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next)));
      return;
    }

    const d = dragRef.current;
    if (!d?.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const el = containerRef.current;
    if (!el) return;
    const elW = el.clientWidth;
    const elH = el.clientHeight;
    const scaleX = WORLD_SVG_W / zoom / elW;
    const scaleY = WORLD_SVG_H / zoom / elH;
    setPan({ x: d.basePanX - dx * scaleX, y: d.basePanY - dy * scaleY });
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0 && dragRef.current) {
      dragRef.current.active = false;
    }
  }

  function navigateToChapter(id: string) {
    // Search-result click goes straight to the chapter page.
    onClose();
    router.push(`/chapters/${id}`);
  }

  function statusLabel(c: { status: string }) {
    if (c.status === "founding") return "Founding Chapter";
    if (c.status === "active") return "Active";
    if (c.status === "launching") return "Launching Q3";
    return "Applications open";
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200]"
          style={{ background: "#050816" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 md:gap-6 px-4 md:px-10 py-4 md:py-5"
            style={{
              borderBottom: "1px solid rgba(212, 168, 67, 0.12)",
              background:
                "linear-gradient(to bottom, rgba(5,8,22,0.85) 0%, rgba(5,8,22,0.5) 100%)",
              backdropFilter: "blur(14px)",
            }}
          >
            <span
              className="text-eyebrow shrink-0 hidden sm:block"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
            >
              The Network
            </span>
            <div
              className="flex-1 max-w-xl mx-auto relative"
            >
              <span
                aria-hidden
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]"
                style={{ color: "rgba(212, 168, 67, 0.6)" }}
              >
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search a city, university, or country"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full pl-10 pr-4 py-3 outline-none text-base sm:text-[14px] tracking-wide"
                style={{
                  background: "rgba(20, 27, 45, 0.6)",
                  border: "1px solid rgba(30, 42, 69, 1)",
                  color: "#F0ECE4",
                  fontFamily: "var(--font-manrope)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(212, 168, 67, 0.55)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(30, 42, 69, 1)")
                }
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "rgba(20, 27, 45, 0.6)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "rgba(240, 236, 228, 0.7)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212, 168, 67, 0.5)";
                e.currentTarget.style.color = "#E8C97A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(30, 42, 69, 1)";
                e.currentTarget.style.color = "rgba(240, 236, 228, 0.7)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Search result list (visible when query non-empty) */}
          {query && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-30 mt-2 w-full max-w-xl px-6 md:px-10"
              style={{ top: 80 }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(20, 27, 45, 0.95)",
                  border: "1px solid rgba(30, 42, 69, 1)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {filtered.length === 0 ? (
                  <p
                    className="px-5 py-4 text-[14px]"
                    style={{ color: "rgba(240, 236, 228, 0.5)" }}
                  >
                    No chapters match. New ones are joining every quarter.
                  </p>
                ) : (
                  filtered.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseEnter={() => setHoveredId(c.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigateToChapter(c.id)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(30,42,69,0.6)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "rgba(212,168,67,0.06)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              c.status === "founding" ? "#FFE7A8" : "#D4A843",
                            boxShadow: "0 0 8px rgba(212,168,67,0.5)",
                          }}
                        />
                        <span
                          className="font-display text-[15px]"
                          style={{ color: "#F0ECE4" }}
                        >
                          {c.city}
                        </span>
                        <span
                          className="text-eyebrow"
                          style={{ color: "rgba(240, 236, 228, 0.4)" }}
                        >
                          {c.university ?? c.country}
                        </span>
                      </div>
                      <span
                        className="text-eyebrow"
                        style={{
                          color:
                            c.status === "founding"
                              ? "#E8C97A"
                              : "rgba(232, 201, 122, 0.55)",
                        }}
                      >
                        {statusLabel(c)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Map canvas */}
          <div
            ref={containerRef}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-0 select-none"
            style={{ cursor: "grab", touchAction: "none" }}
          >
            <svg
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
            >
              <defs>
                <radialGradient id="exDot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E8C97A" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#D4A843" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="exDotFounding" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE7A8" stopOpacity="1" />
                  <stop offset="40%" stopColor="#E8C97A" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
                </radialGradient>
              </defs>

              <path
                d={WORLD_SVG_PATH}
                fill="rgba(212,168,67,0.05)"
                stroke="rgba(212,168,67,0.22)"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />

              {projected.map((c) => {
                const isFounding = c.status === "founding";
                const isMatch =
                  !query ||
                  filtered.some((f) => f.id === c.id);
                const isHover = hoveredId === c.id;
                const baseR = isFounding ? 4 : 2.6;
                const haloR = isFounding ? 24 : 14;
                return (
                  <ChapterDotInteractive
                    key={c.id}
                    chapter={c}
                    px={c.px}
                    py={c.py}
                    isFounding={isFounding}
                    isMatch={isMatch}
                    isHover={isHover}
                    baseR={baseR}
                    haloR={haloR}
                    zoom={zoom}
                    onHover={setHoveredId}
                    onNavigate={onClose}
                  />
                );
              })}
            </svg>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            <ZoomBtn
              ariaLabel="Zoom out"
              onClick={() =>
                setZoom((z) => Math.max(MIN_ZOOM, z / ZOOM_STEP))
              }
            >
              −
            </ZoomBtn>
            <div
              className="rounded-full px-5 py-2 text-eyebrow"
              style={{
                background: "rgba(20, 27, 45, 0.7)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "rgba(240, 236, 228, 0.6)",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </div>
            <ZoomBtn
              ariaLabel="Zoom in"
              onClick={() =>
                setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP))
              }
            >
              +
            </ZoomBtn>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="ml-3 rounded-full px-4 py-2 text-eyebrow transition-colors"
              style={{
                background: "rgba(20, 27, 45, 0.7)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "rgba(240, 236, 228, 0.55)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#E8C97A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(240, 236, 228, 0.55)")
              }
            >
              Reset
            </button>
          </div>

          {/* Hover tooltip (anchored to hovered chapter) */}
          <ChapterTooltip
            chapter={
              hoveredId
                ? projected.find((c) => c.id === hoveredId) ?? null
                : null
            }
            zoom={zoom}
            pan={pan}
            containerRef={containerRef}
          />

          {/* Hint at top right (desktop) / bottom (mobile) */}
          <div
            className="hidden md:block absolute right-10 z-30 text-eyebrow text-right pointer-events-none"
            style={{
              top: 92,
              color: "rgba(240, 236, 228, 0.32)",
            }}
          >
            <p>Drag to pan · Scroll to zoom</p>
            <p className="mt-1">Click a node to open its chapter</p>
          </div>
          <p
            className="md:hidden absolute left-1/2 -translate-x-1/2 z-30 text-eyebrow whitespace-nowrap pointer-events-none"
            style={{
              bottom: 80,
              color: "rgba(240, 236, 228, 0.32)",
            }}
          >
            Pinch · Drag · Tap a node
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ZoomBtn({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[18px] transition-colors"
      style={{
        background: "rgba(20, 27, 45, 0.7)",
        border: "1px solid rgba(30, 42, 69, 1)",
        color: "rgba(240, 236, 228, 0.7)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212, 168, 67, 0.5)";
        e.currentTarget.style.color = "#E8C97A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(30, 42, 69, 1)";
        e.currentTarget.style.color = "rgba(240, 236, 228, 0.7)";
      }}
    >
      {children}
    </button>
  );
}

function ChapterDotInteractive({
  chapter,
  px,
  py,
  isFounding,
  isMatch,
  isHover,
  baseR,
  haloR,
  zoom,
  onHover,
  onNavigate,
}: {
  chapter: (typeof CHAPTERS)[number];
  px: number;
  py: number;
  isFounding: boolean;
  isMatch: boolean;
  isHover: boolean;
  baseR: number;
  haloR: number;
  zoom: number;
  onHover: (id: string | null) => void;
  onNavigate: () => void;
}) {
  // As we zoom in, dots shrink in SVG units to stay roughly the same on-screen size
  const r = baseR / Math.sqrt(zoom);
  const halo = haloR / Math.sqrt(zoom);
  const opacity = isMatch ? 1 : 0.18;
  return (
    <Link href={`/chapters/${chapter.id}`} onClick={onNavigate}>
      <g
        onMouseEnter={() => onHover(chapter.id)}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: "pointer", opacity }}
      >
        <circle
          cx={px}
          cy={py}
          r={halo * (isHover ? 1.4 : 1)}
          fill={isFounding ? "url(#exDotFounding)" : "url(#exDot)"}
          style={{ transition: "all 200ms ease" }}
        />
        <circle
          cx={px}
          cy={py}
          r={r * (isHover ? 1.3 : 1)}
          fill={isFounding ? "#FFE7A8" : "#D4A843"}
          style={{ transition: "all 200ms ease" }}
        />
        {/* Larger invisible hit target */}
        <circle cx={px} cy={py} r={Math.max(halo, 12)} fill="transparent" />
      </g>
    </Link>
  );
}

function ChapterTooltip({
  chapter,
  zoom,
  pan,
  containerRef,
}: {
  chapter: (typeof CHAPTERS)[number] | null;
  zoom: number;
  pan: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!chapter) return null;

  // Project chapter SVG -> screen pixel
  const el = containerRef.current;
  if (!el) return null;
  const w = el.clientWidth;
  const h = el.clientHeight;

  const { x, y } = project(chapter.lng, chapter.lat);
  const svgX = x * WORLD_SVG_W;
  const svgY = y * WORLD_SVG_H;

  // Current viewBox
  const vbW = WORLD_SVG_W / zoom;
  const vbH = WORLD_SVG_H / zoom;
  const vbX = (WORLD_SVG_W - vbW) / 2 + pan.x;
  const vbY = (WORLD_SVG_H - vbH) / 2 + pan.y;

  // preserveAspectRatio meet: figure out which axis fits
  const svgAspect = WORLD_SVG_W / WORLD_SVG_H;
  const elAspect = w / h;
  let scale: number;
  let offX = 0;
  let offY = 0;
  if (elAspect > svgAspect) {
    scale = h / vbH;
    offX = (w - vbW * scale) / 2;
  } else {
    scale = w / vbW;
    offY = (h - vbH * scale) / 2;
  }

  const screenX = (svgX - vbX) * scale + offX;
  const screenY = (svgY - vbY) * scale + offY;

  const offscreen =
    screenX < -40 || screenX > w + 40 || screenY < -40 || screenY > h + 40;
  if (offscreen) return null;

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: screenX,
        top: screenY,
        transform: "translate(20px, -50%)",
      }}
    >
      <div
        className="rounded-xl px-4 py-3 whitespace-nowrap"
        style={{
          background: "rgba(20, 27, 45, 0.95)",
          border: "1px solid rgba(212, 168, 67, 0.35)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <p
          className="font-display text-[16px] mb-0.5"
          style={{
            color: chapter.status === "founding" ? "#E8C97A" : "#F0ECE4",
          }}
        >
          {chapter.city}
        </p>
        <p
          className="text-eyebrow"
          style={{ color: "rgba(240, 236, 228, 0.45)" }}
        >
          {chapter.university ?? chapter.country}
        </p>
      </div>
    </div>
  );
}
