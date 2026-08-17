// PUBLIC connection details for the review board's database. Safe to commit and safe to ship in
// the built HTML — which is just as well, because this repo is public and so is the deployed page.
//
// THE ANON KEY IS NOT A SECRET AND IS NOT A DOOR. It identifies the project; it grants nothing on
// its own. The `review` schema grants USAGE to `authenticated` and to `service_role` only, so an
// anonymous caller holding this key is refused at the schema boundary — "permission denied for
// schema review" — before row-level security is even consulted. Verified against the live project:
// anon reads and writes are refused on every table, a signed-in user's reads succeed.
//
// WHAT MUST NEVER APPEAR IN THIS FILE, OR ANY FILE HERE: the service-role key. It bypasses RLS
// entirely. scripts/sync-review-board.mjs takes it from the environment and exits with instructions
// if it is missing, precisely so there is no reason for it to be written down.
export const REVIEW_DB = {
  url: "https://riwmmxhrpgcunfwikxqm.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpd21teGhycGdjdW5md2lreHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MzU3MjksImV4cCI6MjEwMjUxMTcyOX0.g5af2kpI7G8xCP2diAYEG0cn4z-I7b6Yvrtuv_tOeWY",
  schema: "review",
};
