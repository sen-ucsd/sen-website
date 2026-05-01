/**
 * Hardcoded admin credentials for the San Diego chapter exec board.
 * Replace with Supabase Auth once we're ready to roll out real accounts.
 */
export const ADMIN_USERS: Record<string, string> = {
  Aryan: "SEN",
  Shawn: "SEN",
  Jesse: "SEN",
  Andrew: "SEN",
  Irene: "SEN",
};

export const ADMIN_USER_LIST = Object.keys(ADMIN_USERS);

export const ADMIN_COOKIE_NAME = "sen_admin_user";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days
