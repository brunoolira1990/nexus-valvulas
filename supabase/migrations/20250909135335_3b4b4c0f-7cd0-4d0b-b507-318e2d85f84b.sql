-- Inserir um usuário admin na tabela profiles
-- Você precisará fazer login com este email: admin@nexusvalvulas.com
-- Senha: admin123

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nexusvalvulas.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
);

-- Criar perfil admin para este usuário
INSERT INTO public.profiles (user_id, role, display_name)
SELECT id, 'admin', 'Administrador'
FROM auth.users 
WHERE email = 'admin@nexusvalvulas.com';