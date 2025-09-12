-- Add position column to variants table for manual ordering
ALTER TABLE public.variants ADD COLUMN position INTEGER DEFAULT 0;

-- Update existing variants with default positions using a simpler approach
DO $$
DECLARE
    r RECORD;
    counter INTEGER;
BEGIN
    FOR r IN (SELECT DISTINCT product_id FROM public.variants ORDER BY product_id) LOOP
        counter := 1;
        UPDATE public.variants 
        SET position = counter
        WHERE id IN (
            SELECT id FROM public.variants 
            WHERE product_id = r.product_id 
            ORDER BY type, size
        ) AND position = 0;
        counter := counter + 1;
    END LOOP;
END $$;