-- Signed-in users may only edit their own display fields directly (RLS already limits rows to their own).
-- Attribution (kwop_k, source, intended_plan), email and last_plan are written by the server only.
revoke update on public.profiles from anon, authenticated;
grant update (name, answers, goal_monthly, goal_started_at) on public.profiles to authenticated;
