-- Security Fix: Remove dangerous user role self-assignment policy
DROP POLICY IF EXISTS "Allow authenticated to update their roles" ON public.user_roles;

-- Security Fix: Add proper DELETE policies for profiles table
CREATE POLICY "Only admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Security Fix: Add proper DELETE policies for vendors table  
CREATE POLICY "Only admins can delete vendors" ON public.vendors
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Security Fix: Ensure only admins can manage user roles
CREATE POLICY "Only admins can insert user roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update user roles" ON public.user_roles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete user roles" ON public.user_roles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Security Enhancement: Add audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log administrative actions for security audit
  INSERT INTO public.admin_audit_log (admin_id, action, table_name, record_id, timestamp)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), now());
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_log
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Add audit triggers for sensitive tables
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER audit_vendor_changes
  AFTER UPDATE OR DELETE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();