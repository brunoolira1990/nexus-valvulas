-- Add position column to variants table for manual ordering
ALTER TABLE public.variants ADD COLUMN position INTEGER DEFAULT 0;

-- Update existing variants with default positions
UPDATE public.variants 
SET position = ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY type, size);