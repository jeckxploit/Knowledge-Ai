-- Create user_roles table FIRST
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create has_role function AFTER user_roles table exists
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create AI query audit logs table
CREATE TABLE public.ai_query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT NOT NULL DEFAULT 'answered',
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  answer_mode TEXT DEFAULT 'concise',
  sources JSONB DEFAULT '[]'::jsonb,
  context_snippets JSONB DEFAULT '[]'::jsonb,
  is_out_of_context BOOLEAN DEFAULT false,
  out_of_context_reason TEXT,
  processing_time_ms INTEGER,
  model_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID,
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.ai_query_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own logs
CREATE POLICY "Users can view their own query logs"
ON public.ai_query_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow service role to insert logs (for edge functions)
CREATE POLICY "Service role can insert logs"
ON public.ai_query_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for admins to view all query logs
CREATE POLICY "Admins can view all query logs"
ON public.ai_query_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_ai_query_logs_user_id ON public.ai_query_logs(user_id);
CREATE INDEX idx_ai_query_logs_created_at ON public.ai_query_logs(created_at DESC);

-- Create knowledge base documents table for RAG
CREATE TABLE public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT DEFAULT 'document',
  sensitivity_level TEXT DEFAULT 'internal',
  tags TEXT[] DEFAULT '{}',
  department TEXT,
  author TEXT,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view non-confidential documents
CREATE POLICY "Authenticated users can view documents"
ON public.knowledge_documents
FOR SELECT
TO authenticated
USING (sensitivity_level != 'confidential' OR public.has_role(auth.uid(), 'admin'));

-- Insert sample knowledge documents
INSERT INTO public.knowledge_documents (title, content, document_type, sensitivity_level, tags, department) VALUES
('Remote Work Policy', 'Employees may work remotely up to 3 days per week with manager approval. International employees require additional visa and tax compliance documentation. Remote workers must maintain core hours of 10am-3pm in their local timezone.', 'policy', 'internal', ARRAY['remote', 'policy', 'hr'], 'Human Resources'),
('Data Warehouse Access', 'To request access to the data warehouse, submit a ticket through the IT Service Portal. Include your department, manager name, and business justification. Access is typically granted within 2-3 business days.', 'procedure', 'internal', ARRAY['data', 'access', 'it'], 'IT'),
('PII Data Security Protocols', 'All PII data must be encrypted at rest and in transit. Access requires Level 2 security clearance. Data retention is limited to 7 years. Annual compliance training is mandatory for all handlers.', 'policy', 'confidential', ARRAY['security', 'pii', 'compliance'], 'Security'),
('Employee Onboarding Process', 'New employees complete a 5-day onboarding program including: Day 1 - HR orientation, Day 2 - IT setup, Day 3 - Department introduction, Day 4-5 - Role-specific training.', 'procedure', 'public', ARRAY['onboarding', 'hr', 'new-hire'], 'Human Resources'),
('Q2 Product Roadmap', 'Q2 focus areas include: Mobile app redesign, API v3 launch, and enterprise dashboard improvements. Detailed timelines are available in the Product Planning portal.', 'internal', 'internal', ARRAY['product', 'roadmap', 'planning'], 'Product');