"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskStatus, TaskWithChildren, Task } from "./TaskBoard";
import { ADMIN_USER_LIST } from "@/lib/admin-auth";
import { InlineAddTask } from "./InlineAddTask";

const STATUS_META: Record<
  TaskStatus,
  { label: string; bg: string; fg: string; dot: string }
> = {
  todo: {
    label: "To Do",
    bg: "rgba(30, 42, 69, 0.7)",
    fg: "rgba(240, 236, 228, 0.65)",
    dot: "rgba(240, 236, 228, 0.5)",
  },
  in_progress: {
    label: "In Progress",
    bg: "rgba(212, 168, 67, 0.12)",
    fg: "#E8C97A",
    dot: "#E8C97A",
  },
  done: {
    label: "Done",
    bg: "rgba(122, 200, 146, 0.12)",
    fg: "#7AC892",
    dot: "#7AC892",
  },
  blocked: {
    label: "Blocked",
    bg: "rgba(232, 140, 122, 0.12)",
    fg: "#E88C7A",
    dot: "#E88C7A",
  },
};

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "done", "blocked"];

interface Props {
  task: TaskWithChildren;
  depth: number;
  onAddChild: (parent: Task, title: string) => void | Promise<void>;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

function formatDate(d: string) {
  // "2026-05-20" → "May 20"
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  const date = new Date(y, m - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskNode({ task, depth, onAddChild, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description ?? "",
    due_date: task.due_date ?? "",
  });

  const meta = STATUS_META[task.status];
  const isOverdue =
    !!task.due_date &&
    task.due_date < new Date().toISOString().slice(0, 10) &&
    task.status !== "done";
  const hasChildren = task.children.length > 0;

  function startEdit() {
    setDraft({
      title: task.title,
      description: task.description ?? "",
      due_date: task.due_date ?? "",
    });
    setDrawerOpen(true);
  }
  function commitEdit() {
    const t = draft.title.trim();
    if (!t) {
      setDrawerOpen(false);
      return;
    }
    onUpdate(task.id, {
      title: t,
      description: draft.description.trim() || null,
      due_date: draft.due_date || null,
    });
    setDrawerOpen(false);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="relative list-none"
    >
      {/* Horizontal connector from spine to this card */}
      <span
        aria-hidden
        className="absolute top-5 md:top-7 -left-[18px] md:-left-[34px] w-3 md:w-7 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(160, 124, 46, 0.45) 0%, rgba(212, 168, 67, 0.4) 100%)",
        }}
      />
      {/* Node dot at the spine */}
      <span
        aria-hidden
        className="absolute top-[18px] md:top-[26px] -left-[20px] md:-left-[38px] inline-block w-1.5 md:w-2 h-1.5 md:h-2 rounded-full pointer-events-none"
        style={{
          background: meta.dot,
          boxShadow: `0 0 8px ${
            meta.dot === "rgba(240, 236, 228, 0.5)"
              ? "rgba(240,236,228,0.4)"
              : meta.dot
          }`,
        }}
      />

      <div
        className="rounded-xl md:rounded-xl overflow-hidden transition-all"
        style={{
          background: "rgba(20, 27, 45, 0.5)",
          border: `1px solid ${
            isOverdue
              ? "rgba(232, 140, 122, 0.4)"
              : "rgba(30, 42, 69, 1)"
          }`,
        }}
      >
        {/* Mobile compact card. Chevron + main tap target are siblings (no nested buttons). */}
        <div className="md:hidden flex items-stretch">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse" : "Expand"}
              className="shrink-0 w-9 flex items-start justify-center pt-3.5"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
            >
              <motion.span
                aria-hidden
                className="inline-block text-[11px]"
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.18 }}
              >
                ▸
              </motion.span>
            </button>
          ) : (
            <span aria-hidden className="shrink-0 w-3" />
          )}
          <button
            type="button"
            onClick={startEdit}
            className="flex-1 min-w-0 text-left pr-3.5 py-3 active:bg-[rgba(212,168,67,0.04)] transition-colors"
          >
            <div className="mb-1.5">
              <span
                className="block text-[15px] leading-tight line-clamp-2"
                style={{
                  color:
                    task.status === "done"
                      ? "rgba(240, 236, 228, 0.45)"
                      : "#F0ECE4",
                  textDecoration:
                    task.status === "done" ? "line-through" : "none",
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                }}
              >
                {task.title}
              </span>
            </div>

            {/* Meta row: status + assignee + date */}
            <div className="flex items-center gap-2 text-[11px] flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
                style={{
                  background: meta.bg,
                  color: meta.fg,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: meta.dot }}
                />
                {meta.label}
              </span>
              {task.assignee && (
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: "rgba(240, 236, 228, 0.6)" }}
                >
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                    style={{
                      background: "rgba(212, 168, 67, 0.15)",
                      color: "#E8C97A",
                      fontFamily: "var(--font-newsreader)",
                    }}
                  >
                    {task.assignee.charAt(0)}
                  </span>
                  {task.assignee}
                </span>
              )}
              {task.due_date && (
                <span
                  style={{
                    color: isOverdue ? "#E88C7A" : "rgba(240, 236, 228, 0.5)",
                  }}
                >
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Desktop layout — single row */}
        <div className="hidden md:flex items-center gap-3 px-5 py-3.5">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse" : "Expand"}
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
              style={{
                color: "rgba(232, 201, 122, 0.7)",
                background: "rgba(212, 168, 67, 0.06)",
              }}
            >
              <motion.span
                aria-hidden
                className="inline-block text-[11px]"
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.18 }}
              >
                ▸
              </motion.span>
            </button>
          ) : (
            <span
              aria-hidden
              className="shrink-0 w-6 h-6 flex items-center justify-center"
              style={{ color: "rgba(240, 236, 228, 0.15)" }}
            >
              ·
            </span>
          )}

          <button
            type="button"
            onClick={startEdit}
            className="flex-1 min-w-0 text-left text-[15px] leading-snug truncate"
            style={{
              color:
                task.status === "done"
                  ? "rgba(240, 236, 228, 0.4)"
                  : "#F0ECE4",
              textDecoration:
                task.status === "done" ? "line-through" : "none",
              fontFamily: "var(--font-manrope)",
              fontWeight: 500,
            }}
          >
            {task.title}
          </button>

          <StatusPill
            status={task.status}
            onChange={(s) => onUpdate(task.id, { status: s })}
          />
          <AssigneeChip
            value={task.assignee}
            onChange={(v) => onUpdate(task.id, { assignee: v })}
          />
          <DateChip
            value={task.due_date}
            isOverdue={isOverdue}
            onChange={(v) => onUpdate(task.id, { due_date: v })}
          />

          <div className="flex items-center gap-1 shrink-0">
            {confirmDelete ? (
              <div
                className="flex items-center gap-1 rounded-full pl-2 pr-1 py-0.5"
                style={{
                  background: "rgba(232, 140, 122, 0.12)",
                  border: "1px solid rgba(232, 140, 122, 0.4)",
                }}
              >
                <span
                  className="text-[10px] tracking-wide"
                  style={{ color: "#E88C7A" }}
                >
                  Delete?
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="text-[10px] tracking-wide rounded-full px-2 py-0.5"
                  style={{
                    background: "#E88C7A",
                    color: "#050816",
                    fontWeight: 500,
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-[10px] tracking-wide rounded-full px-2 py-0.5"
                  style={{ color: "rgba(240, 236, 228, 0.6)" }}
                >
                  No
                </button>
              </div>
            ) : (
              <IconButton
                label="Delete task"
                onClick={() => setConfirmDelete(true)}
                symbol="×"
                danger
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom-sheet edit drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <MobileEditSheet
            task={task}
            draft={draft}
            setDraft={setDraft}
            onClose={() => setDrawerOpen(false)}
            onSave={commitEdit}
            onUpdate={onUpdate}
            onDelete={() => {
              setDrawerOpen(false);
              onDelete(task.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* Children + inline add */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative ml-4 md:ml-7 pl-4 md:pl-7 mt-3 space-y-3"
          >
            <div
              aria-hidden
              className="absolute top-0 left-0 bottom-6 w-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(160, 124, 46, 0.4) 0%, rgba(160, 124, 46, 0.15) 100%)",
              }}
            />

            <ol className="space-y-3">
              {task.children.map((child) => (
                <TaskNode
                  key={child.id}
                  task={child}
                  depth={depth + 1}
                  onAddChild={onAddChild}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </ol>

            <div className="relative pt-1">
              <span
                aria-hidden
                className="absolute -left-4 md:-left-7 top-[14px] w-3 md:w-[22px] h-px pointer-events-none"
                style={{ background: "rgba(160, 124, 46, 0.3)" }}
              />
              <span
                aria-hidden
                className="absolute -left-[18px] md:-left-[31px] top-[10px] inline-block w-[6px] md:w-[7px] h-[6px] md:h-[7px] rounded-full pointer-events-none"
                style={{ background: "rgba(160, 124, 46, 0.45)" }}
              />
              <InlineAddTask
                placeholder="Add a subtask"
                compact
                onSubmit={(title) => onAddChild(task, title)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/* Mobile edit sheet — slides up from the bottom */
function MobileEditSheet({
  task,
  draft,
  setDraft,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}: {
  task: TaskWithChildren;
  draft: { title: string; description: string; due_date: string };
  setDraft: React.Dispatch<
    React.SetStateAction<{ title: string; description: string; due_date: string }>
  >;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="md:hidden fixed inset-0 z-[80]">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(5, 8, 22, 0.7)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="absolute inset-x-0 bottom-0 rounded-t-2xl"
        style={{
          background: "#0A0E1A",
          borderTop: "1px solid rgba(212, 168, 67, 0.25)",
          maxHeight: "92dvh",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <span
            aria-hidden
            className="block w-10 h-1 rounded-full"
            style={{ background: "rgba(212, 168, 67, 0.3)" }}
          />
        </div>

        <div className="px-5 pb-4 max-h-[80dvh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "rgba(232, 201, 122, 0.6)" }}
            >
              Edit Task
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "rgba(240, 236, 228, 0.6)",
              }}
            >
              <span aria-hidden className="text-[14px] leading-none">×</span>
            </button>
          </div>

          {/* Title */}
          <label className="block mb-4">
            <span
              className="block text-[11px] tracking-wide mb-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Title
            </span>
            <textarea
              autoFocus
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              rows={2}
              className="w-full rounded-lg px-3 py-2.5 text-base outline-none resize-none"
              style={{
                background: "rgba(5, 8, 22, 0.6)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "#F0ECE4",
                fontFamily: "var(--font-manrope)",
              }}
            />
          </label>

          {/* Status */}
          <div className="mb-4">
            <span
              className="block text-[11px] tracking-wide mb-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Status
            </span>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const m = STATUS_META[s];
                const active = task.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdate(task.id, { status: s })}
                    className="flex items-center justify-center gap-2 rounded-full py-2.5 text-[12px] tracking-wide transition-all"
                    style={{
                      background: active ? m.bg : "rgba(20, 27, 45, 0.5)",
                      color: active ? m.fg : "rgba(240, 236, 228, 0.55)",
                      border: `1px solid ${
                        active ? "rgba(212, 168, 67, 0.4)" : "rgba(30, 42, 69, 1)"
                      }`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: m.dot }}
                    />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee */}
          <div className="mb-4">
            <span
              className="block text-[11px] tracking-wide mb-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Assignee
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onUpdate(task.id, { assignee: null })}
                className="rounded-full px-3 py-1.5 text-[12px]"
                style={{
                  background:
                    task.assignee === null
                      ? "rgba(212, 168, 67, 0.12)"
                      : "rgba(20, 27, 45, 0.5)",
                  border: `1px solid ${
                    task.assignee === null
                      ? "rgba(212, 168, 67, 0.4)"
                      : "rgba(30, 42, 69, 1)"
                  }`,
                  color:
                    task.assignee === null
                      ? "#E8C97A"
                      : "rgba(240, 236, 228, 0.5)",
                }}
              >
                Unassigned
              </button>
              {ADMIN_USER_LIST.map((u) => {
                const active = task.assignee === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => onUpdate(task.id, { assignee: u })}
                    className="rounded-full px-3 py-1.5 text-[12px] inline-flex items-center gap-1.5"
                    style={{
                      background: active
                        ? "rgba(212, 168, 67, 0.12)"
                        : "rgba(20, 27, 45, 0.5)",
                      border: `1px solid ${
                        active
                          ? "rgba(212, 168, 67, 0.4)"
                          : "rgba(30, 42, 69, 1)"
                      }`,
                      color: active ? "#E8C97A" : "rgba(240, 236, 228, 0.7)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                      style={{
                        background: "rgba(212, 168, 67, 0.18)",
                        color: "#E8C97A",
                        fontFamily: "var(--font-newsreader)",
                      }}
                    >
                      {u.charAt(0)}
                    </span>
                    {u}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due date */}
          <div className="mb-4">
            <span
              className="block text-[11px] tracking-wide mb-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Due Date
            </span>
            <input
              type="date"
              value={draft.due_date}
              onChange={(e) =>
                setDraft((d) => ({ ...d, due_date: e.target.value }))
              }
              className="w-full rounded-lg px-3 py-2.5 text-base outline-none"
              style={{
                background: "rgba(5, 8, 22, 0.6)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "#F0ECE4",
                colorScheme: "dark",
                fontFamily: "var(--font-manrope)",
              }}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <span
              className="block text-[11px] tracking-wide mb-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Notes
            </span>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              rows={4}
              placeholder="Anything that frames this task — links, context, blockers."
              className="w-full rounded-lg px-3 py-2.5 text-base outline-none"
              style={{
                background: "rgba(5, 8, 22, 0.6)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "#F0ECE4",
                fontFamily: "var(--font-manrope)",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-full py-3 font-display text-[14px] tracking-wide"
              style={{
                background: "#D4A843",
                color: "#050816",
                fontWeight: 500,
              }}
            >
              Save
            </button>
            {confirming ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-full px-4 py-3 text-[12px]"
                  style={{
                    background: "#E88C7A",
                    color: "#050816",
                    fontWeight: 500,
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full px-3 py-3 text-[12px]"
                  style={{ color: "rgba(240, 236, 228, 0.6)" }}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                aria-label="Delete task"
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(232, 140, 122, 0.4)",
                  color: "rgba(232, 140, 122, 0.7)",
                }}
              >
                <span aria-hidden className="text-[18px] leading-none">×</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatusPill({
  status,
  onChange,
}: {
  status: TaskStatus;
  onChange: (s: TaskStatus) => void;
}) {
  const meta = STATUS_META[status];
  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as TaskStatus)}
        className="appearance-none text-[11px] tracking-[0.18em] uppercase rounded-full pl-7 pr-7 py-1.5 outline-none cursor-pointer"
        style={{
          background: meta.bg,
          color: meta.fg,
          border: "1px solid rgba(30, 42, 69, 0.5)",
          fontFamily: "var(--font-manrope)",
          fontWeight: 500,
        }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} style={{ background: "#0A0E1A" }}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="absolute left-2.5 top-1/2 -translate-y-1/2 inline-block w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{ background: meta.dot }}
      />
      <span
        aria-hidden
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none"
        style={{ color: meta.fg }}
      >
        ▾
      </span>
    </div>
  );
}

function AssigneeChip({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="appearance-none text-[11px] rounded-full px-3 py-1.5 outline-none cursor-pointer"
      style={{
        background: value
          ? "rgba(20, 27, 45, 0.7)"
          : "rgba(20, 27, 45, 0.3)",
        color: value ? "#F0ECE4" : "rgba(240, 236, 228, 0.4)",
        border: "1px solid rgba(30, 42, 69, 1)",
        fontFamily: "var(--font-manrope)",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23A07C2E' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        paddingRight: 22,
      }}
    >
      <option value="" style={{ background: "#0A0E1A" }}>
        Unassigned
      </option>
      {ADMIN_USER_LIST.map((u) => (
        <option key={u} value={u} style={{ background: "#0A0E1A" }}>
          {u}
        </option>
      ))}
    </select>
  );
}

function DateChip({
  value,
  isOverdue,
  onChange,
}: {
  value: string | null;
  isOverdue: boolean;
  onChange: (v: string | null) => void;
}) {
  return (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-[11px] rounded-full px-3 py-1.5 outline-none"
      style={{
        background: value
          ? isOverdue
            ? "rgba(232, 140, 122, 0.12)"
            : "rgba(20, 27, 45, 0.7)"
          : "rgba(20, 27, 45, 0.3)",
        color: value
          ? isOverdue
            ? "#E88C7A"
            : "#F0ECE4"
          : "rgba(240, 236, 228, 0.4)",
        border: "1px solid rgba(30, 42, 69, 1)",
        colorScheme: "dark",
        fontFamily: "var(--font-manrope)",
      }}
    />
  );
}

function IconButton({
  symbol,
  label,
  onClick,
  danger,
}: {
  symbol: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
      style={{
        color: danger
          ? "rgba(232, 140, 122, 0.6)"
          : "rgba(232, 201, 122, 0.7)",
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(232, 140, 122, 0.12)"
          : "rgba(212, 168, 67, 0.1)";
        e.currentTarget.style.color = danger ? "#E88C7A" : "#E8C97A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = danger
          ? "rgba(232, 140, 122, 0.6)"
          : "rgba(232, 201, 122, 0.7)";
      }}
    >
      <span aria-hidden className="text-[16px] leading-none">
        {symbol}
      </span>
    </button>
  );
}
