-- Add new product categories
-- This migration adds the missing categories from the current website

INSERT INTO public.categories (name, description, slug) VALUES
('Conexões', 'Conexões industriais para tubulações', 'conexoes'),
('Flanges', 'Flanges para conexões de tubulações industriais', 'flanges'),
('Tubos', 'Tubos industriais para diversas aplicações', 'tubos'),
('Acessórios', 'Acessórios industriais para válvulas e tubulações', 'acessorios'),
('Combate Incêndio', 'Equipamentos para sistemas de combate a incêndio', 'combate-incendio'),
('Diversos', 'Produtos diversos para aplicações industriais', 'diversos')
ON CONFLICT (slug) DO NOTHING;