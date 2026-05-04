/**
 * Sentinel assignee meaning "the whole board". Treated as "yours" for every
 * signed-in user, so whole-board tasks surface in everyone's queue.
 *
 * Real admin users now live in Supabase Auth (auth.users) with a mirror in
 * public.profiles. Fetch the list of display names from that table at runtime
 * instead of importing a hardcoded array here.
 */
export const ASSIGNEE_EVERYONE = "Everyone";
