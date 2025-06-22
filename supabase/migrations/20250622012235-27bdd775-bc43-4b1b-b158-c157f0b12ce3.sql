
-- Add admin role to lekanogundeji@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'lekanogundeji@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
