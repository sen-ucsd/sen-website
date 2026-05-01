"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ADMIN_USER_LIST, ASSIGNEE_EVERYONE } from "@/lib/admin-auth";
import { VisionCard } from "./VisionCard";
import { TaskNode, sortByPriority } from "./TaskNode";
import { InlineAddTask } from "./InlineAddTask";
import { BrandedSelect, type SelectOption } from "./BrandedSelect";

export type TaskKind = "vision" | "task";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export interface Task {
  id: string;
  chapter_id: string;
  parent_id: string | null;
  kind: TaskKind;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "low" | "normal" | "high" | "urgent";
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

const ASSIGNEE_FILTER_OPTIONS: SelectOption<string>[] = [
  { value: "all", label: "Anyone" },
  {
    value: ASSIGNEE_EVERYONE,
    label: ASSIGNEE_EVERYONE,
    hint: "Whole board",
    dot: "#E8C97A",
  },
  ...ADMIN_USER_LIST.map<SelectOption<string>>((u) => ({
    value: u,
    label: u,
    badge: u.charAt(0),
  })),
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

  const vision = useMemo(
    () => tasks.find((t) => t.kind === "vision") ?? null,
    [tasks]
  );

  // Tasks descend from the vision. Top-level tasks have parent_id = vision.id.
  // Within each level, sort by assignee priority for the current user.
  const tree = useMemo<TaskWithChildren[]>(() => {
    if (!vision) return [];
    const byParent = new Map<string | null, Task[]>();
    for (const t of tasks) {
      if (t.kind === "vision") continue;
      const arr = byParent.get(t.parent_id) ?? [];
      arr.push(t);
      byParent.set(t.parent_id, arr);
    }
    function build(parentId: string | null): TaskWithChildren[] {
      const list = byParent.get(parentId) ?? [];
      const built = list.map((t) => ({ ...t, children: build(t.id) }));
      return sortByPriority(built, currentUser);
    }
    const fromVision = build(vision.id);
    const legacyRoots = build(null);
    return sortByPriority([...fromVision, ...legacyRoots], currentUser);
  }, [tasks, vision, currentUser]);

  // "Your focus" — count of tasks assigned to current user (or Everyone) and not done
  const yourCount = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.kind !== "vision" &&
        t.status !== "done" &&
        (t.assignee === currentUser || t.assignee === ASSIGNEE_EVERYONE)
    ).length;
  }, [tasks, currentUser]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let total = 0,
      todo = 0,
      inProgress = 0,
      done = 0,
      blocked = 0,
      overdue = 0;
    for (const t of tasks) {
      if (t.kind === "vision") continue;
      total++;
      if (t.status === "todo") todo++;
      else if (t.status === "in_progress") inProgress++;
      else if (t.status === "done") done++;
      else if (t.status === "blocked") blocked++;
      if (t.due_date && t.due_date < today && t.status !== "done") overdue++;
    }
    return { total, todo, inProgress, done, blocked, overdue };
  }, [tasks]);

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
        if (matches(n) || kids.length > 0) out.push({ ...n, children: kids });
      }
      return out;
    }
    return filter(tree);
  }, [tree, statusFilter, assigneeFilter]);

  async function addTask(parentId: string, title: string) {
    const t = title.trim();
    if (!t) return;
    const sibs = tasks.filter((x) => x.parent_id === parentId);
    const maxPos = sibs.reduce((m, x) => Math.max(m, x.position), -1);
    const { error: e } = await supabase.from("tasks").insert({
      chapter_id: "san-diego",
      kind: "task",
      title: t,
      parent_id: parentId,
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

  async function deleteTask(id: string) {
    const { error: e } = await supabase.from("tasks").delete().eq("id", id);
    if (e) setError(e.message);
  }

  if (loading) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: "rgba(20, 27, 45, 0.4)",
          border: "1px solid rgba(30, 42, 69, 1)",
        }}
      >
        <p className="text-[14px]" style={{ color: "rgba(240, 236, 228, 0.5)" }}>
          Loading the network…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Vision (root of the WBS) */}
      {vision && (
        <VisionCard vision={vision} onUpdate={updateTask} />
      )}

      {/* Stats — 3-col compact on mobile, 6-col on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="In Prog" labelFull="In Progress" value={stats.inProgress} accent="#E8C97A" />
        <Stat label="Overdue" value={stats.overdue} accent="#E88C7A" />
        <Stat label="To Do" value={stats.todo} accent="rgba(240,236,228,0.7)" />
        <Stat label="Done" value={stats.done} accent="#7AC892" />
        <Stat label="Blocked" value={stats.blocked} accent="#E88C7A" />
      </div>

      {/* Your-focus pill + controls */}
      <div className="flex flex-col gap-3">
        {/* Your focus banner */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(212, 168, 67, 0.14) 0%, rgba(212, 168, 67, 0.06) 100%)",
              border: "1px solid rgba(212, 168, 67, 0.35)",
            }}
          >
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]"
              style={{
                background: "rgba(212, 168, 67, 0.25)",
                color: "#E8C97A",
                fontFamily: "var(--font-newsreader)",
                fontWeight: 600,
              }}
            >
              {currentUser.charAt(0)}
            </span>
            <span
              className="text-[11px] tracking-[0.18em] uppercase"
              style={{ color: "#E8C97A", fontFamily: "var(--font-manrope)", fontWeight: 500 }}
            >
              Your Focus
            </span>
            <span
              className="font-display text-[14px]"
              style={{ color: "#F0ECE4", fontWeight: 500 }}
            >
              {yourCount} {yourCount === 1 ? "task" : "tasks"}
            </span>
          </div>
          <span
            className="text-[11px]"
            style={{ color: "rgba(240, 236, 228, 0.4)" }}
          >
            Tasks assigned to you (or the whole board) appear first.
          </span>
        </div>

        {/* Filter row — branded throughout */}
        <div
          className="flex items-center gap-2 md:gap-3 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className="shrink-0 text-[12px] tracking-wide rounded-full px-3.5 md:px-4 py-1.5 transition-colors"
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

          <span
            className="shrink-0 w-px h-5 mx-1"
            style={{ background: "rgba(30,42,69,1)" }}
          />

          <BrandedSelect
            ariaLabel="Filter by assignee"
            value={assigneeFilter}
            options={ASSIGNEE_FILTER_OPTIONS}
            onChange={(v) => setAssigneeFilter(v)}
            menuMinWidth={180}
          />
        </div>
      </div>

      {error && (
        <p className="text-[13px]" style={{ color: "#E8A35E" }}>
          {error}
        </p>
      )}

      {/* The flow: vision → initiatives → tasks → subtasks */}
      {vision && (
        <div className="relative">
          {/* Vertical spine going down from the vision (compact on mobile) */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 w-px pointer-events-none left-3 md:left-6"
            style={{
              background:
                "linear-gradient(to bottom, rgba(212, 168, 67, 0.45) 0%, rgba(160, 124, 46, 0.2) 30%, rgba(160, 124, 46, 0.1) 100%)",
            }}
          />

          <div className="space-y-3 md:space-y-4 pl-7 md:pl-12">
            <AnimatePresence initial={false}>
              {filteredTree.map((t) => (
                <TaskNode
                  key={t.id}
                  task={t}
                  depth={0}
                  currentUser={currentUser}
                  onAddChild={(parent, title) => addTask(parent.id, title)}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </AnimatePresence>

            {/* Inline add at the root level */}
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-[18px] md:-left-[34px] top-[14px] md:top-5 inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                style={{
                  background: "rgba(212, 168, 67, 0.35)",
                  boxShadow: "0 0 8px rgba(212, 168, 67, 0.3)",
                }}
              />
              <span
                aria-hidden
                className="absolute -left-[16px] md:-left-[28px] top-[18px] md:top-[24px] w-3 md:w-5 h-px pointer-events-none"
                style={{ background: "rgba(160, 124, 46, 0.3)" }}
              />
              <InlineAddTask
                placeholder="Add an initiative under the vision…"
                onSubmit={(title) => addTask(vision.id, title)}
              />
            </div>
          </div>
        </div>
      )}

      {!vision && (
        <p
          className="text-[14px] text-center py-12"
          style={{ color: "rgba(240, 236, 228, 0.4)" }}
        >
          No vision set yet for this chapter.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  labelFull,
  value,
  accent = "#F0ECE4",
}: {
  label: string;
  labelFull?: string;
  value: number;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl md:rounded-2xl p-3 md:p-4"
      style={{
        background: "rgba(20, 27, 45, 0.4)",
        border: "1px solid rgba(30, 42, 69, 1)",
      }}
    >
      <p
        className="text-[9px] md:text-[11px] tracking-[0.18em] md:tracking-[0.25em] uppercase font-medium mb-1.5 md:mb-2 truncate"
        style={{
          color: "rgba(240, 236, 228, 0.4)",
          fontFamily: "var(--font-manrope)",
        }}
      >
        <span className="md:hidden">{label}</span>
        <span className="hidden md:inline">{labelFull ?? label}</span>
      </p>
      <p
        className="font-display text-[22px] md:text-[28px] leading-none"
        style={{ color: accent, fontWeight: 500 }}
      >
        {value}
      </p>
    </div>
  );
}
