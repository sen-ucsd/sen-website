"use client";

import { useRef } from "react";
import { FindATime } from "./FindATime";
import { UpcomingEvents, type UpcomingEventsHandle } from "./UpcomingEvents";

/**
 * Pairs the slot picker with the upcoming-events list. After a successful
 * schedule we tell the upcoming list to refresh so the new event appears
 * without a page reload.
 */
export function SchedulingPanel() {
  const upcomingRef = useRef<UpcomingEventsHandle>(null);
  return (
    <div className="space-y-3 md:space-y-4">
      <UpcomingEvents ref={upcomingRef} />
      <FindATime onScheduled={() => upcomingRef.current?.refresh()} />
    </div>
  );
}
