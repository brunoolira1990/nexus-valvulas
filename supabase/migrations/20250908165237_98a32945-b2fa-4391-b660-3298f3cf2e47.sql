-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    images TEXT[], -- Array of image URLs
    pdfs TEXT[], -- Array of PDF URLs
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create variants table
CREATE TABLE public.variants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type TEXT, -- e.g., "Tripartida", "Bipartida"
    size TEXT, -- e.g., "1/2'", "3/4'"
    specifications JSONB, -- Store technical specs as JSON
    drawing_url TEXT, -- Technical drawing image
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    cover_image TEXT,
    summary TEXT,
    content TEXT NOT NULL,
    published_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    meta_description TEXT,
    keywords TEXT[],
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (catalog data)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Variants are viewable by everyone" 
ON public.variants FOR SELECT USING (true);

CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts FOR SELECT USING (published = true);

-- Create admin-only policies for content management
CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can manage products" 
ON public.products FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can manage variants" 
ON public.variants FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can manage blog posts" 
ON public.blog_posts FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
));

-- Profile policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_variants_updated_at
    BEFORE UPDATE ON public.variants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial categories
INSERT INTO public.categories (name, description, slug) VALUES
('Válvulas de Esfera', 'Válvulas de esfera para aplicações industriais', 'valvulas-esfera'),
('Válvulas de Gaveta', 'Válvulas de gaveta para sistemas de tubulação', 'valvulas-gaveta'),
('Válvulas de Globo', 'Válvulas de globo para controle de fluxo', 'valvulas-globo'),
('Válvulas de Retenção', 'Válvulas de retenção para prevenção de refluxo', 'valvulas-retencao');