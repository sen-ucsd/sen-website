"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ADMIN_USER_LIST } from "@/lib/admin-auth";
import { TaskNode } from "./TaskNode";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export interface Task {
  id: string;
  chapter_id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  due_date: string | null;
  position: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithChildren extends Task {
  children: TaskWithChildren[];
}

const STATUS_FILTERS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
];

export function TaskBoard({ currentUser }: { currentUser: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string | "all">("all");

  // Initial fetch + realtime subscribe
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error: e } = await supabase
        .from("tasks")
        .select("*")
        .eq("chapter_id", "san-diego")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (!mounted) return;
      if (e) setError(e.message);
      else setTasks(data ?? []);
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel("tasks_san_diego")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: "chapter_id=eq.san-diego",
        },
        () => load()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Build the tree
  const tree = useMemo<TaskWithChildren[]>(() => {
    const byParent = new Map<string | null, Task[]>();
    for (const t of tasks) {
      const arr = byParent.get(t.parent_id) ?? [];
      arr.push(t);
      byParent.set(t.parent_id, arr);
    }
    function build(parentId: string | null): TaskWithChildren[] {
      const list = byParent.get(parentId) ?? [];
      return list.map((t) => ({ ...t, children: build(t.id) }));
    }
    return build(null);
  }, [tasks]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let total = 0,
      todo = 0,
      inProgress = 0,
      done = 0,
      blocked = 0,
      overdue = 0;
    for (const t of tasks) {
      total++;
      if (t.status === "todo") todo++;
      else if (t.status === "in_progress") inProgress++;
      else if (t.status === "done") done++;
      else if (t.status === "blocked") blocked++;
      if (
        t.due_date &&
        t.due_date < today &&
        t.status !== "done"
      )
        overdue++;
    }
    return { total, todo, inProgress, done, blocked, overdue };
  }, [tasks]);

  // Apply filters to the tree (keep nodes whose subtree contains a match)
  const filteredTree = useMemo<TaskWithChildren[]>(() => {
    if (statusFilter === "all" && assigneeFilter === "all") return tree;
    function matches(t: Task) {
      const okStatus = statusFilter === "all" || t.status === statusFilter;
      const okAssignee =
        assigneeFilter === "all" || t.assignee === assigneeFilter;
      return okStatus && okAssignee;
    }
    function filter(nodes: TaskWithChildren[]): TaskWithChildren[] {
      const out: TaskWithChildren[] = [];
      for (const n of nodes) {
        const kids = filter(n.children);
        if (matches(n) || kids.length > 0) {
          out.push({ ...n, children: kids });
        }
      }
      return out;
    }
    return filter(tree);
  }, [tree, statusFilter, assigneeFilter]);

  async function addRootTask() {
    const title = window.prompt("New task title:");
    if (!title?.trim()) return;
    const maxPos = tasks
      .filter((t) => t.parent_id === null)
      .reduce((m, t) => Math.max(m, t.position), -1);
    const { error: e } = await supabase.from("tasks").insert({
      chapter_id: "san-diego",
      title: title.trim(),
      parent_id: null,
      position: maxPos + 1,
      created_by: currentUser,
      updated_by: currentUser,
    });
    if (e) setError(e.message);
  }

  async function addChild(parent: Task) {
    const title = window.prompt(`Subtask under "${parent.title}":`);
    if (!title?.trim()) return;
    const sibs = tasks.filter((t) => t.parent_id === parent.id);
    const maxPos = sibs.reduce((m, t) => Math.max(m, t.position), -1);
    const { error: e } = await supabase.from("tasks").insert({
      chapter_id: "san-diego",
      title: title.trim(),
      parent_id: parent.id,
      position: maxPos + 1,
      created_by: currentUser,
      updated_by: currentUser,
    });
    if (e) setError(e.message);
  }

  async function updateTask(id: string, patch: Partial<Task>) {
    const { error: e } = await supabase
      .from("tasks")
      .update({ ...patch, updated_by: currentUser })
      .eq("id", id);
    if (e) setError(e.message);
  }

  async function deleteTask(t: Task) {
    const subCount = tasks.filter((x) => x.parent_id === t.id).length;
    const msg =
      subCount > 0
        ? `Delete "${t.title}" and ${subCount} subtask${subCount === 1 ? "" : "s"}?`
        : `Delete "${t.title}"?`;
    if (!window.confirm(msg)) return;
    const { error: e } = await supabase.from("tasks").delete().eq("id", t.id);
    if (e) setError(e.message);
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        <Stat label="Total" value={stats.total} />
        <Stat label="To Do" value={stats.todo} accent="rgba(240,236,228,0.6)" />
        <Stat label="In Progress" value={stats.inProgress} accent="#E8C97A" />
        <Stat label="Done" value={stats.done} accent="#7AC892" />
        <Stat label="Blocked" value={stats.blocked} accent="#E88C7A" />
        <Stat label="Overdue" value={stats.overdue} accent="#E88C7A" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className="text-[12px] tracking-wide rounded-full px-4 py-1.5 transition-colors"
              style={{
                border: "1px solid",
                borderColor:
                  statusFilter === f.value
                    ? "rgba(212, 168, 67, 0.55)"
                    : "rgba(30, 42, 69, 1)",
                background:
                  statusFilter === f.value
                    ? "rgba(212, 168, 67, 0.08)"
                    : "transparent",
                color:
                  statusFilter === f.value
                    ? "#E8C97A"
                    : "rgba(240, 236, 228, 0.55)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="text-[12px] rounded-full px-4 py-1.5 outline-none appearance-none"
          style={{
            background: "rgba(20, 27, 45, 0.5)",
            border: "1px solid rgba(30, 42, 69, 1)",
            color: "rgba(240, 236, 228, 0.7)",
            fontFamily: "var(--font-manrope)",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23A07C2E' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            paddingRight: 32,
          }}
        >
          <option value="all" style={{ background: "#0A0E1A" }}>
            Everyone
          </option>
          {ADMIN_USER_LIST.map((u) => (
            <option key={u} value={u} style={{ background: "#0A0E1A" }}>
              {u}
            </option>
          ))}
        </select>

        <div className="ml-auto">
          <motion.button
            type="button"
            onClick={addRootTask}
            className="rounded-full px-5 py-2 font-display text-[13px] tracking-wide"
            style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(212,168,67,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            + New Task
          </motion.button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-[13px]" style={{ color: "#E8A35E" }}>
          {error}
        </p>
      )}

      {/* Tree */}
      {loading ? (
        <p className="text-[14px]" style={{ color: "rgba(240,236,228,0.4)" }}>
          Loading…
        </p>
      ) : filteredTree.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(20, 27, 45, 0.4)",
            border: "1px dashed rgba(160, 124, 46, 0.3)",
          }}
        >
          <p
            className="font-display text-[20px] mb-3"
            style={{ color: "rgba(240, 236, 228, 0.7)", fontWeight: 500 }}
          >
            {tasks.length === 0
              ? "Nothing here yet."
              : "No tasks match these filters."}
          </p>
          <p
            className="text-[14px] max-w-md mx-auto"
            style={{ color: "rgba(240, 236, 228, 0.45)" }}
          >
            {tasks.length === 0
              ? "Create the first root task to start breaking down the quarter."
              : "Loosen a filter or clear it to see everything."}
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredTree.map((t) => (
              <TaskNode
                key={t.id}
                task={t}
                depth={0}
                onAddChild={addChild}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "#F0ECE4",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(20, 27, 45, 0.4)",
        border: "1px solid rgba(30, 42, 69, 1)",
      }}
    >
      <p
        className="text-eyebrow mb-2"
        style={{ color: "rgba(240, 236, 228, 0.4)" }}
      >
        {label}
      </p>
      <p
        className="font-display text-[28px] leading-none"
        style={{ color: accent, fontWeight: 500 }}
      >
        {value}
      </p>
    </div>
  );
}
