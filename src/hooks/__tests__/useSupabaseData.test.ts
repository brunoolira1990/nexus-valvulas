import { renderHook, act } from '@testing-library/react';
import { useCategories, useProducts } from '../useSupabaseData';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('useSupabaseData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCategories', () => {
    it('deve inicializar com estado correto', () => {
      const { result } = renderHook(() => useCategories());
      
      expect(result.current.categories).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('deve chamar a função de fetch na montagem', () => {
      renderHook(() => useCategories());
      
      expect(supabase.from).toHaveBeenCalledWith('categories');
    });
  });

  describe('useProducts', () => {
    it('deve inicializar com estado correto', () => {
      const { result } = renderHook(() => useProducts());
      
      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('deve chamar a função de fetch na montagem', () => {
      renderHook(() => useProducts());
      
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });
});