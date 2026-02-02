-- Fix overly permissive INSERT policy
DROP POLICY IF EXISTS "Service role can insert logs" ON public.ai_query_logs;

-- Allow authenticated users to insert their own logs
CREATE POLICY "Users can insert their own logs"
ON public.ai_query_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);