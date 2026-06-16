-- Grant USAGE on private schema so RLS policies can call helper functions
-- Without this, even though EXECUTE is granted on the functions,
-- the anon/authenticated roles cannot access objects in the private schema,
-- causing all RLS policy evaluations to fail with 403.

grant usage on schema private to anon, authenticated;
