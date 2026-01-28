import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const productEditSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  is_active: z.boolean().optional(),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
});

type ProductEditFormValues = z.infer<typeof productEditSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface VariantSize {
  id: number;
  size_label: string;
  image_url?: string;
  variant: number | null;
  product: number | null;
}

interface Variant {
  id: number;
  name: string;
  description?: string;
}

export default function AdminProductEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<VariantSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      is_active: true,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  // Carregar categorias e produto
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        const token = localStorage.getItem('authToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const [categoriesRes, productRes] = await Promise.all([
          fetch(`${API_BASE}/products/categories/`, { headers: authHeader }),
          fetch(`${API_BASE}/products/products/${slug}/`, { headers: authHeader }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        if (!productRes.ok) {
          throw new Error('Erro ao carregar produto');
        }

        const categoriesData = await categoriesRes.json();
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || [];
        setCategories(categoriesArray);

        const productData = await productRes.json();

        // Converter specifications de objeto para array
        const specsArray = productData.specifications && typeof productData.specifications === 'object'
          ? Object.entries(productData.specifications).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : [];

        form.reset({
          title: productData.title || '',
          slug: productData.slug || '',
          description: productData.description || '',
          category_id: String(productData.category),
          is_active: productData.is_active ?? true,
          specifications: specsArray,
        });
        setImageUrl(productData.image_url || null);

        // Estrutura de variantes e tamanhos
        // Variantes
        const variantList: Variant[] = (productData.variants || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description,
        }));
        setVariants(variantList);

        // Tamanhos: diretos do produto + tamanhos das variantes (com IDs)
        const directSizes: VariantSize[] = (productData.sizes_detail || []).map((s: any) => ({
          id: s.id,
          size_label: s.size_label,
          image_url: s.image_url,
          variant: s.variant,
          product: s.product,
        }));

        const variantSizes: VariantSize[] = (productData.variants || []).flatMap((v: any) =>
          (v.sizes_detail || []).map((s: any) => ({
            id: s.id,
            size_label: s.size_label,
            image_url: s.image_url,
            variant: v.id,
            product: null,
          })),
        );

        setSizes([...directSizes, ...variantSizes]);
      } catch (error: any) {
        console.error('Erro ao carregar dados do produto:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar o produto',
          variant: 'destructive',
        });
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (values: ProductEditFormValues) => {
    if (!slug) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const categoryId = parseInt(values.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID de categoria inválido');
      }

      // Converter specifications de array para objeto JSON
      const specsObj: Record<string, string> = {};
      if (values.specifications && values.specifications.length > 0) {
        values.specifications.forEach((spec) => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        description: values.description || '',
        category: categoryId,
        is_active: values.is_active ?? true,
        specifications: specsObj,
      };

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          (errorData.slug && Array.isArray(errorData.slug) ? errorData.slug[0] : errorData.slug) ||
          (errorData.title && Array.isArray(errorData.title) ? errorData.title[0] : errorData.title) ||
          JSON.stringify(errorData) ||
          'Erro ao atualizar produto';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!slug) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Erro ao atualizar imagem';
        throw new Error(errorMessage);
      }

      const updated = await res.json();
      setImageUrl(updated.image_url || null);

      toast({
        title: 'Imagem atualizada',
        description: 'A imagem principal do produto foi atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar imagem do produto',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Produto</h1>
              <p className="text-muted-foreground text-sm">
                Atualize as informações básicas do produto. Estrutura de tamanhos/variantes será ajustada em etapa
                futura.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto</CardTitle>
            <CardDescription>Edite os campos principais do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="slug-do-produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Descrição do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Produto ativo</FormLabel>
                          <CardDescription className="text-xs">
                            Defina se o produto deve aparecer no site público.
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              Adicione especificações técnicas do produto (ex: Norma, Material, Pressão)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Material, Norma, Pressão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aço Carbono WCB, ANSI B16.34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeSpec(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSpec({ key: '', value: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Especificação
            </Button>
          </CardContent>
        </Card>

        {/* Imagem principal do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Produto</CardTitle>
            <CardDescription>
              Visualize e altere a imagem principal que aparece na vitrine e na página de detalhes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Imagem do produto" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Nenhuma imagem definida para este produto.
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="product-image">Atualizar imagem</Label>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos recomendados: JPG ou PNG. A imagem será usada na vitrine e nas páginas de detalhes do
                  produto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura de variantes e tamanhos (somente para visualização/remoção/adição básica) */}
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Variantes e Tamanhos</CardTitle>
            <CardDescription>
              Gerencie variantes e tamanhos deste produto. A criação mantém o fluxo simplificado: nome da variante e
              tamanhos com imagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variantes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Variantes</h3>
                {/* Se existir qualquer tamanho direto (produto intermediário), não permitir adicionar variantes */}
                {sizes.filter((s) => s.variant === null).length === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const name = window.prompt('Nome da nova variante:');
                      if (!name || !slug) return;

                    const run = async () => {
                      try {
                        const token = localStorage.getItem('authToken');
                        if (!token) throw new Error('Não autenticado');

                        const formData = new FormData();
                        formData.append('name', name);

                        const res = await fetch(`${API_BASE}/products/products/${slug}/variants/`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        });

                        if (!res.ok) {
                          const error = await res.json().catch(() => ({}));
                          throw new Error(error.detail || 'Erro ao criar variante');
                        }

                        const created = await res.json();
                        setVariants((prev) => [...prev, { id: created.id, name: created.name }]);
                        toast({ title: 'Variante criada com sucesso' });
                      } catch (error: any) {
                        console.error('Erro ao criar variante:', error);
                        toast({
                          title: 'Erro',
                          description: error.message || 'Erro ao criar variante',
                          variant: 'destructive',
                        });
                      }
                    };

                      run();
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                )}
              </div>

              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          {variant.description && (
                            <p className="text-xs text-muted-foreground">{variant.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!window.confirm(`Remover variante "${variant.name}" e seus tamanhos?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/variants/${variant.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover variante');
                                }

                                setVariants((prev) => prev.filter((v) => v.id !== variant.id));
                                setSizes((prev) => prev.filter((s) => s.variant !== variant.id));
                                toast({ title: 'Variante removida com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover variante:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover variante',
                                  variant: 'destructive',
                                });
                              }
                            };
                            run();
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Tamanhos da variante */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tamanhos</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const sizeLabel = window.prompt('Tamanho (ex: 1/2", 1", 2"):');
                              if (!sizeLabel) return;

                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = () => {
                                if (!input.files || input.files.length === 0) return;
                                const file = input.files[0];

                                const run = async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) throw new Error('Não autenticado');

                                    const formData = new FormData();
                                    formData.append('size_label', sizeLabel);
                                    formData.append('image', file);

                                    const res = await fetch(
                                      `${API_BASE}/products/variants/${variant.id}/sizes/`,
                                      {
                                        method: 'POST',
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: formData,
                                      },
                                    );

                                    if (!res.ok) {
                                      const error = await res.json().catch(() => ({}));
                                      throw new Error(error.detail || 'Erro ao adicionar tamanho');
                                    }

                                    const created = await res.json();
                                    setSizes((prev) => [
                                      ...prev,
                                      {
                                        id: created.id,
                                        size_label: created.size_label,
                                        image_url: created.image_url,
                                        variant: variant.id,
                                        product: null,
                                      },
                                    ]);
                                    toast({ title: 'Tamanho adicionado com sucesso' });
                                  } catch (error: any) {
                                    console.error('Erro ao adicionar tamanho:', error);
                                    toast({
                                      title: 'Erro',
                                      description: error.message || 'Erro ao adicionar tamanho',
                                      variant: 'destructive',
                                    });
                                  }
                                };

                                run();
                              };
                              input.click();
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Adicionar Tamanho
                          </Button>
                        </div>

                        {sizes.filter((s) => s.variant === variant.id).length === 0 ? (
                          <p className="text-xs text-muted-foreground">Nenhum tamanho cadastrado.</p>
                        ) : (
                          <div className="space-y-1">
                            {sizes
                              .filter((s) => s.variant === variant.id)
                              .map((size) => (
                                <div
                                  key={size.id}
                                  className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    {size.image_url && (
                                      <img
                                        src={size.image_url}
                                        alt={size.size_label}
                                        className="h-8 w-8 rounded object-contain bg-muted"
                                      />
                                    )}
                                    <span>{size.size_label}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                                      const run = async () => {
                                        try {
                                          const token = localStorage.getItem('authToken');
                                          if (!token) throw new Error('Não autenticado');

                                          const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                            method: 'DELETE',
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          });

                                          if (!res.ok) {
                                            const error = await res.json().catch(() => ({}));
                                            throw new Error(error.detail || 'Erro ao remover tamanho');
                                          }

                                          setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                          toast({ title: 'Tamanho removido com sucesso' });
                                        } catch (error: any) {
                                          console.error('Erro ao remover tamanho:', error);
                                          toast({
                                            title: 'Erro',
                                            description: error.message || 'Erro ao remover tamanho',
                                            variant: 'destructive',
                                          });
                                        }
                                      };
                                      run();
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tamanhos diretos do produto (sem variante) */}
            {/* Se existir qualquer variante, esconder completamente os tamanhos diretos */}
            {variants.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Tamanhos Diretos (Produto intermediário)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!slug) return;
                      const sizeLabel = window.prompt('Tamanho (ex: 1/2\", 1\", 2\"):');
                      if (!sizeLabel) return;

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = () => {
                      if (!input.files || input.files.length === 0) return;
                      const file = input.files[0];

                      const run = async () => {
                        try {
                          const token = localStorage.getItem('authToken');
                          if (!token) throw new Error('Não autenticado');

                          const formData = new FormData();
                          formData.append('size_label', sizeLabel);
                          formData.append('image', file);

                          const res = await fetch(`${API_BASE}/products/products/${slug}/sizes/`, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) {
                            const error = await res.json().catch(() => ({}));
                            throw new Error(error.detail || 'Erro ao adicionar tamanho');
                          }

                          const created = await res.json();
                          setSizes((prev) => [
                            ...prev,
                            {
                              id: created.id,
                              size_label: created.size_label,
                              image_url: created.image_url,
                              variant: null,
                              product: created.product,
                            },
                          ]);
                          toast({ title: 'Tamanho adicionado com sucesso' });
                        } catch (error: any) {
                          console.error('Erro ao adicionar tamanho:', error);
                          toast({
                            title: 'Erro',
                            description: error.message || 'Erro ao adicionar tamanho',
                            variant: 'destructive',
                          });
                        }
                      };

                      run();
                    };
                    input.click();
                  }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </div>

                {sizes.filter((s) => s.variant === null).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum tamanho direto cadastrado.</p>
                ) : (
                  <div className="space-y-1">
                    {sizes
                      .filter((s) => s.variant === null)
                      .map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {size.image_url && (
                              <img
                                src={size.image_url}
                                alt={size.size_label}
                                className="h-8 w-8 rounded object-contain bg-muted"
                              />
                            )}
                            <span>{size.size_label}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                            if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover tamanho');
                                }

                                setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                toast({ title: 'Tamanho removido com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover tamanho:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover tamanho',
                                  variant: 'destructive',
                                });
                              }
                            };
                              run();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}



import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const productEditSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  is_active: z.boolean().optional(),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
});

type ProductEditFormValues = z.infer<typeof productEditSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface VariantSize {
  id: number;
  size_label: string;
  image_url?: string;
  variant: number | null;
  product: number | null;
}

interface Variant {
  id: number;
  name: string;
  description?: string;
}

export default function AdminProductEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<VariantSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      is_active: true,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  // Carregar categorias e produto
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        const token = localStorage.getItem('authToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const [categoriesRes, productRes] = await Promise.all([
          fetch(`${API_BASE}/products/categories/`, { headers: authHeader }),
          fetch(`${API_BASE}/products/products/${slug}/`, { headers: authHeader }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        if (!productRes.ok) {
          throw new Error('Erro ao carregar produto');
        }

        const categoriesData = await categoriesRes.json();
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || [];
        setCategories(categoriesArray);

        const productData = await productRes.json();

        // Converter specifications de objeto para array
        const specsArray = productData.specifications && typeof productData.specifications === 'object'
          ? Object.entries(productData.specifications).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : [];

        form.reset({
          title: productData.title || '',
          slug: productData.slug || '',
          description: productData.description || '',
          category_id: String(productData.category),
          is_active: productData.is_active ?? true,
          specifications: specsArray,
        });
        setImageUrl(productData.image_url || null);

        // Estrutura de variantes e tamanhos
        // Variantes
        const variantList: Variant[] = (productData.variants || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description,
        }));
        setVariants(variantList);

        // Tamanhos: diretos do produto + tamanhos das variantes (com IDs)
        const directSizes: VariantSize[] = (productData.sizes_detail || []).map((s: any) => ({
          id: s.id,
          size_label: s.size_label,
          image_url: s.image_url,
          variant: s.variant,
          product: s.product,
        }));

        const variantSizes: VariantSize[] = (productData.variants || []).flatMap((v: any) =>
          (v.sizes_detail || []).map((s: any) => ({
            id: s.id,
            size_label: s.size_label,
            image_url: s.image_url,
            variant: v.id,
            product: null,
          })),
        );

        setSizes([...directSizes, ...variantSizes]);
      } catch (error: any) {
        console.error('Erro ao carregar dados do produto:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar o produto',
          variant: 'destructive',
        });
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (values: ProductEditFormValues) => {
    if (!slug) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const categoryId = parseInt(values.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID de categoria inválido');
      }

      // Converter specifications de array para objeto JSON
      const specsObj: Record<string, string> = {};
      if (values.specifications && values.specifications.length > 0) {
        values.specifications.forEach((spec) => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        description: values.description || '',
        category: categoryId,
        is_active: values.is_active ?? true,
        specifications: specsObj,
      };

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          (errorData.slug && Array.isArray(errorData.slug) ? errorData.slug[0] : errorData.slug) ||
          (errorData.title && Array.isArray(errorData.title) ? errorData.title[0] : errorData.title) ||
          JSON.stringify(errorData) ||
          'Erro ao atualizar produto';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!slug) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Erro ao atualizar imagem';
        throw new Error(errorMessage);
      }

      const updated = await res.json();
      setImageUrl(updated.image_url || null);

      toast({
        title: 'Imagem atualizada',
        description: 'A imagem principal do produto foi atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar imagem do produto',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Produto</h1>
              <p className="text-muted-foreground text-sm">
                Atualize as informações básicas do produto. Estrutura de tamanhos/variantes será ajustada em etapa
                futura.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto</CardTitle>
            <CardDescription>Edite os campos principais do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="slug-do-produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Descrição do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Produto ativo</FormLabel>
                          <CardDescription className="text-xs">
                            Defina se o produto deve aparecer no site público.
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              Adicione especificações técnicas do produto (ex: Norma, Material, Pressão)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Material, Norma, Pressão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aço Carbono WCB, ANSI B16.34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeSpec(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSpec({ key: '', value: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Especificação
            </Button>
          </CardContent>
        </Card>

        {/* Imagem principal do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Produto</CardTitle>
            <CardDescription>
              Visualize e altere a imagem principal que aparece na vitrine e na página de detalhes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Imagem do produto" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Nenhuma imagem definida para este produto.
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="product-image">Atualizar imagem</Label>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos recomendados: JPG ou PNG. A imagem será usada na vitrine e nas páginas de detalhes do
                  produto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura de variantes e tamanhos (somente para visualização/remoção/adição básica) */}
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Variantes e Tamanhos</CardTitle>
            <CardDescription>
              Gerencie variantes e tamanhos deste produto. A criação mantém o fluxo simplificado: nome da variante e
              tamanhos com imagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variantes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Variantes</h3>
                {/* Se existir qualquer tamanho direto (produto intermediário), não permitir adicionar variantes */}
                {sizes.filter((s) => s.variant === null).length === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const name = window.prompt('Nome da nova variante:');
                      if (!name || !slug) return;

                    const run = async () => {
                      try {
                        const token = localStorage.getItem('authToken');
                        if (!token) throw new Error('Não autenticado');

                        const formData = new FormData();
                        formData.append('name', name);

                        const res = await fetch(`${API_BASE}/products/products/${slug}/variants/`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        });

                        if (!res.ok) {
                          const error = await res.json().catch(() => ({}));
                          throw new Error(error.detail || 'Erro ao criar variante');
                        }

                        const created = await res.json();
                        setVariants((prev) => [...prev, { id: created.id, name: created.name }]);
                        toast({ title: 'Variante criada com sucesso' });
                      } catch (error: any) {
                        console.error('Erro ao criar variante:', error);
                        toast({
                          title: 'Erro',
                          description: error.message || 'Erro ao criar variante',
                          variant: 'destructive',
                        });
                      }
                    };

                      run();
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                )}
              </div>

              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          {variant.description && (
                            <p className="text-xs text-muted-foreground">{variant.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!window.confirm(`Remover variante "${variant.name}" e seus tamanhos?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/variants/${variant.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover variante');
                                }

                                setVariants((prev) => prev.filter((v) => v.id !== variant.id));
                                setSizes((prev) => prev.filter((s) => s.variant !== variant.id));
                                toast({ title: 'Variante removida com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover variante:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover variante',
                                  variant: 'destructive',
                                });
                              }
                            };
                            run();
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Tamanhos da variante */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tamanhos</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const sizeLabel = window.prompt('Tamanho (ex: 1/2", 1", 2"):');
                              if (!sizeLabel) return;

                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = () => {
                                if (!input.files || input.files.length === 0) return;
                                const file = input.files[0];

                                const run = async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) throw new Error('Não autenticado');

                                    const formData = new FormData();
                                    formData.append('size_label', sizeLabel);
                                    formData.append('image', file);

                                    const res = await fetch(
                                      `${API_BASE}/products/variants/${variant.id}/sizes/`,
                                      {
                                        method: 'POST',
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: formData,
                                      },
                                    );

                                    if (!res.ok) {
                                      const error = await res.json().catch(() => ({}));
                                      throw new Error(error.detail || 'Erro ao adicionar tamanho');
                                    }

                                    const created = await res.json();
                                    setSizes((prev) => [
                                      ...prev,
                                      {
                                        id: created.id,
                                        size_label: created.size_label,
                                        image_url: created.image_url,
                                        variant: variant.id,
                                        product: null,
                                      },
                                    ]);
                                    toast({ title: 'Tamanho adicionado com sucesso' });
                                  } catch (error: any) {
                                    console.error('Erro ao adicionar tamanho:', error);
                                    toast({
                                      title: 'Erro',
                                      description: error.message || 'Erro ao adicionar tamanho',
                                      variant: 'destructive',
                                    });
                                  }
                                };

                                run();
                              };
                              input.click();
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Adicionar Tamanho
                          </Button>
                        </div>

                        {sizes.filter((s) => s.variant === variant.id).length === 0 ? (
                          <p className="text-xs text-muted-foreground">Nenhum tamanho cadastrado.</p>
                        ) : (
                          <div className="space-y-1">
                            {sizes
                              .filter((s) => s.variant === variant.id)
                              .map((size) => (
                                <div
                                  key={size.id}
                                  className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    {size.image_url && (
                                      <img
                                        src={size.image_url}
                                        alt={size.size_label}
                                        className="h-8 w-8 rounded object-contain bg-muted"
                                      />
                                    )}
                                    <span>{size.size_label}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                                      const run = async () => {
                                        try {
                                          const token = localStorage.getItem('authToken');
                                          if (!token) throw new Error('Não autenticado');

                                          const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                            method: 'DELETE',
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          });

                                          if (!res.ok) {
                                            const error = await res.json().catch(() => ({}));
                                            throw new Error(error.detail || 'Erro ao remover tamanho');
                                          }

                                          setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                          toast({ title: 'Tamanho removido com sucesso' });
                                        } catch (error: any) {
                                          console.error('Erro ao remover tamanho:', error);
                                          toast({
                                            title: 'Erro',
                                            description: error.message || 'Erro ao remover tamanho',
                                            variant: 'destructive',
                                          });
                                        }
                                      };
                                      run();
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tamanhos diretos do produto (sem variante) */}
            {/* Se existir qualquer variante, esconder completamente os tamanhos diretos */}
            {variants.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Tamanhos Diretos (Produto intermediário)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!slug) return;
                      const sizeLabel = window.prompt('Tamanho (ex: 1/2\", 1\", 2\"):');
                      if (!sizeLabel) return;

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = () => {
                      if (!input.files || input.files.length === 0) return;
                      const file = input.files[0];

                      const run = async () => {
                        try {
                          const token = localStorage.getItem('authToken');
                          if (!token) throw new Error('Não autenticado');

                          const formData = new FormData();
                          formData.append('size_label', sizeLabel);
                          formData.append('image', file);

                          const res = await fetch(`${API_BASE}/products/products/${slug}/sizes/`, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) {
                            const error = await res.json().catch(() => ({}));
                            throw new Error(error.detail || 'Erro ao adicionar tamanho');
                          }

                          const created = await res.json();
                          setSizes((prev) => [
                            ...prev,
                            {
                              id: created.id,
                              size_label: created.size_label,
                              image_url: created.image_url,
                              variant: null,
                              product: created.product,
                            },
                          ]);
                          toast({ title: 'Tamanho adicionado com sucesso' });
                        } catch (error: any) {
                          console.error('Erro ao adicionar tamanho:', error);
                          toast({
                            title: 'Erro',
                            description: error.message || 'Erro ao adicionar tamanho',
                            variant: 'destructive',
                          });
                        }
                      };

                      run();
                    };
                    input.click();
                  }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </div>

                {sizes.filter((s) => s.variant === null).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum tamanho direto cadastrado.</p>
                ) : (
                  <div className="space-y-1">
                    {sizes
                      .filter((s) => s.variant === null)
                      .map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {size.image_url && (
                              <img
                                src={size.image_url}
                                alt={size.size_label}
                                className="h-8 w-8 rounded object-contain bg-muted"
                              />
                            )}
                            <span>{size.size_label}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                            if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover tamanho');
                                }

                                setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                toast({ title: 'Tamanho removido com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover tamanho:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover tamanho',
                                  variant: 'destructive',
                                });
                              }
                            };
                              run();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}



import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const productEditSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  is_active: z.boolean().optional(),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
});

type ProductEditFormValues = z.infer<typeof productEditSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface VariantSize {
  id: number;
  size_label: string;
  image_url?: string;
  variant: number | null;
  product: number | null;
}

interface Variant {
  id: number;
  name: string;
  description?: string;
}

export default function AdminProductEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<VariantSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      is_active: true,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  // Carregar categorias e produto
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        const token = localStorage.getItem('authToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const [categoriesRes, productRes] = await Promise.all([
          fetch(`${API_BASE}/products/categories/`, { headers: authHeader }),
          fetch(`${API_BASE}/products/products/${slug}/`, { headers: authHeader }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        if (!productRes.ok) {
          throw new Error('Erro ao carregar produto');
        }

        const categoriesData = await categoriesRes.json();
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || [];
        setCategories(categoriesArray);

        const productData = await productRes.json();

        // Converter specifications de objeto para array
        const specsArray = productData.specifications && typeof productData.specifications === 'object'
          ? Object.entries(productData.specifications).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : [];

        form.reset({
          title: productData.title || '',
          slug: productData.slug || '',
          description: productData.description || '',
          category_id: String(productData.category),
          is_active: productData.is_active ?? true,
          specifications: specsArray,
        });
        setImageUrl(productData.image_url || null);

        // Estrutura de variantes e tamanhos
        // Variantes
        const variantList: Variant[] = (productData.variants || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description,
        }));
        setVariants(variantList);

        // Tamanhos: diretos do produto + tamanhos das variantes (com IDs)
        const directSizes: VariantSize[] = (productData.sizes_detail || []).map((s: any) => ({
          id: s.id,
          size_label: s.size_label,
          image_url: s.image_url,
          variant: s.variant,
          product: s.product,
        }));

        const variantSizes: VariantSize[] = (productData.variants || []).flatMap((v: any) =>
          (v.sizes_detail || []).map((s: any) => ({
            id: s.id,
            size_label: s.size_label,
            image_url: s.image_url,
            variant: v.id,
            product: null,
          })),
        );

        setSizes([...directSizes, ...variantSizes]);
      } catch (error: any) {
        console.error('Erro ao carregar dados do produto:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar o produto',
          variant: 'destructive',
        });
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (values: ProductEditFormValues) => {
    if (!slug) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const categoryId = parseInt(values.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID de categoria inválido');
      }

      // Converter specifications de array para objeto
      const specsObj: Record<string, string> = {};
      if (values.specifications && values.specifications.length > 0) {
        values.specifications.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        description: values.description || '',
        category: categoryId,
        is_active: values.is_active ?? true,
        specifications: specsObj,
      };

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          (errorData.slug && Array.isArray(errorData.slug) ? errorData.slug[0] : errorData.slug) ||
          (errorData.title && Array.isArray(errorData.title) ? errorData.title[0] : errorData.title) ||
          JSON.stringify(errorData) ||
          'Erro ao atualizar produto';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!slug) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Erro ao atualizar imagem';
        throw new Error(errorMessage);
      }

      const updated = await res.json();
      setImageUrl(updated.image_url || null);

      toast({
        title: 'Imagem atualizada',
        description: 'A imagem principal do produto foi atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar imagem do produto',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Produto</h1>
              <p className="text-muted-foreground text-sm">
                Atualize as informações básicas do produto. Estrutura de tamanhos/variantes será ajustada em etapa
                futura.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto</CardTitle>
            <CardDescription>Edite os campos principais do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="slug-do-produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Descrição do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Produto ativo</FormLabel>
                          <CardDescription className="text-xs">
                            Defina se o produto deve aparecer no site público.
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              Adicione especificações técnicas do produto (ex: Norma, Material, Pressão)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Material, Norma, Pressão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aço Carbono WCB, ANSI B16.34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeSpec(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSpec({ key: '', value: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Especificação
            </Button>
          </CardContent>
        </Card>

        {/* Imagem principal do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Produto</CardTitle>
            <CardDescription>
              Visualize e altere a imagem principal que aparece na vitrine e na página de detalhes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Imagem do produto" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Nenhuma imagem definida para este produto.
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="product-image">Atualizar imagem</Label>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos recomendados: JPG ou PNG. A imagem será usada na vitrine e nas páginas de detalhes do
                  produto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura de variantes e tamanhos (somente para visualização/remoção/adição básica) */}
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Variantes e Tamanhos</CardTitle>
            <CardDescription>
              Gerencie variantes e tamanhos deste produto. A criação mantém o fluxo simplificado: nome da variante e
              tamanhos com imagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variantes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Variantes</h3>
                {/* Se existir qualquer tamanho direto (produto intermediário), não permitir adicionar variantes */}
                {sizes.filter((s) => s.variant === null).length === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const name = window.prompt('Nome da nova variante:');
                      if (!name || !slug) return;

                    const run = async () => {
                      try {
                        const token = localStorage.getItem('authToken');
                        if (!token) throw new Error('Não autenticado');

                        const formData = new FormData();
                        formData.append('name', name);

                        const res = await fetch(`${API_BASE}/products/products/${slug}/variants/`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        });

                        if (!res.ok) {
                          const error = await res.json().catch(() => ({}));
                          throw new Error(error.detail || 'Erro ao criar variante');
                        }

                        const created = await res.json();
                        setVariants((prev) => [...prev, { id: created.id, name: created.name }]);
                        toast({ title: 'Variante criada com sucesso' });
                      } catch (error: any) {
                        console.error('Erro ao criar variante:', error);
                        toast({
                          title: 'Erro',
                          description: error.message || 'Erro ao criar variante',
                          variant: 'destructive',
                        });
                      }
                    };

                      run();
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                )}
              </div>

              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          {variant.description && (
                            <p className="text-xs text-muted-foreground">{variant.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!window.confirm(`Remover variante "${variant.name}" e seus tamanhos?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/variants/${variant.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover variante');
                                }

                                setVariants((prev) => prev.filter((v) => v.id !== variant.id));
                                setSizes((prev) => prev.filter((s) => s.variant !== variant.id));
                                toast({ title: 'Variante removida com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover variante:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover variante',
                                  variant: 'destructive',
                                });
                              }
                            };
                            run();
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Tamanhos da variante */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tamanhos</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const sizeLabel = window.prompt('Tamanho (ex: 1/2", 1", 2"):');
                              if (!sizeLabel) return;

                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = () => {
                                if (!input.files || input.files.length === 0) return;
                                const file = input.files[0];

                                const run = async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) throw new Error('Não autenticado');

                                    const formData = new FormData();
                                    formData.append('size_label', sizeLabel);
                                    formData.append('image', file);

                                    const res = await fetch(
                                      `${API_BASE}/products/variants/${variant.id}/sizes/`,
                                      {
                                        method: 'POST',
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: formData,
                                      },
                                    );

                                    if (!res.ok) {
                                      const error = await res.json().catch(() => ({}));
                                      throw new Error(error.detail || 'Erro ao adicionar tamanho');
                                    }

                                    const created = await res.json();
                                    setSizes((prev) => [
                                      ...prev,
                                      {
                                        id: created.id,
                                        size_label: created.size_label,
                                        image_url: created.image_url,
                                        variant: variant.id,
                                        product: null,
                                      },
                                    ]);
                                    toast({ title: 'Tamanho adicionado com sucesso' });
                                  } catch (error: any) {
                                    console.error('Erro ao adicionar tamanho:', error);
                                    toast({
                                      title: 'Erro',
                                      description: error.message || 'Erro ao adicionar tamanho',
                                      variant: 'destructive',
                                    });
                                  }
                                };

                                run();
                              };
                              input.click();
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Adicionar Tamanho
                          </Button>
                        </div>

                        {sizes.filter((s) => s.variant === variant.id).length === 0 ? (
                          <p className="text-xs text-muted-foreground">Nenhum tamanho cadastrado.</p>
                        ) : (
                          <div className="space-y-1">
                            {sizes
                              .filter((s) => s.variant === variant.id)
                              .map((size) => (
                                <div
                                  key={size.id}
                                  className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    {size.image_url && (
                                      <img
                                        src={size.image_url}
                                        alt={size.size_label}
                                        className="h-8 w-8 rounded object-contain bg-muted"
                                      />
                                    )}
                                    <span>{size.size_label}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                                      const run = async () => {
                                        try {
                                          const token = localStorage.getItem('authToken');
                                          if (!token) throw new Error('Não autenticado');

                                          const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                            method: 'DELETE',
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          });

                                          if (!res.ok) {
                                            const error = await res.json().catch(() => ({}));
                                            throw new Error(error.detail || 'Erro ao remover tamanho');
                                          }

                                          setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                          toast({ title: 'Tamanho removido com sucesso' });
                                        } catch (error: any) {
                                          console.error('Erro ao remover tamanho:', error);
                                          toast({
                                            title: 'Erro',
                                            description: error.message || 'Erro ao remover tamanho',
                                            variant: 'destructive',
                                          });
                                        }
                                      };
                                      run();
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tamanhos diretos do produto (sem variante) */}
            {/* Se existir qualquer variante, esconder completamente os tamanhos diretos */}
            {variants.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Tamanhos Diretos (Produto intermediário)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!slug) return;
                      const sizeLabel = window.prompt('Tamanho (ex: 1/2\", 1\", 2\"):');
                      if (!sizeLabel) return;

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = () => {
                      if (!input.files || input.files.length === 0) return;
                      const file = input.files[0];

                      const run = async () => {
                        try {
                          const token = localStorage.getItem('authToken');
                          if (!token) throw new Error('Não autenticado');

                          const formData = new FormData();
                          formData.append('size_label', sizeLabel);
                          formData.append('image', file);

                          const res = await fetch(`${API_BASE}/products/products/${slug}/sizes/`, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) {
                            const error = await res.json().catch(() => ({}));
                            throw new Error(error.detail || 'Erro ao adicionar tamanho');
                          }

                          const created = await res.json();
                          setSizes((prev) => [
                            ...prev,
                            {
                              id: created.id,
                              size_label: created.size_label,
                              image_url: created.image_url,
                              variant: null,
                              product: created.product,
                            },
                          ]);
                          toast({ title: 'Tamanho adicionado com sucesso' });
                        } catch (error: any) {
                          console.error('Erro ao adicionar tamanho:', error);
                          toast({
                            title: 'Erro',
                            description: error.message || 'Erro ao adicionar tamanho',
                            variant: 'destructive',
                          });
                        }
                      };

                      run();
                    };
                    input.click();
                  }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </div>

                {sizes.filter((s) => s.variant === null).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum tamanho direto cadastrado.</p>
                ) : (
                  <div className="space-y-1">
                    {sizes
                      .filter((s) => s.variant === null)
                      .map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {size.image_url && (
                              <img
                                src={size.image_url}
                                alt={size.size_label}
                                className="h-8 w-8 rounded object-contain bg-muted"
                              />
                            )}
                            <span>{size.size_label}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                            if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover tamanho');
                                }

                                setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                toast({ title: 'Tamanho removido com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover tamanho:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover tamanho',
                                  variant: 'destructive',
                                });
                              }
                            };
                              run();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}



import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const productEditSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  is_active: z.boolean().optional(),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
});

type ProductEditFormValues = z.infer<typeof productEditSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface VariantSize {
  id: number;
  size_label: string;
  image_url?: string;
  variant: number | null;
  product: number | null;
}

interface Variant {
  id: number;
  name: string;
  description?: string;
}

export default function AdminProductEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<VariantSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      is_active: true,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  // Carregar categorias e produto
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        const token = localStorage.getItem('authToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const [categoriesRes, productRes] = await Promise.all([
          fetch(`${API_BASE}/products/categories/`, { headers: authHeader }),
          fetch(`${API_BASE}/products/products/${slug}/`, { headers: authHeader }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        if (!productRes.ok) {
          throw new Error('Erro ao carregar produto');
        }

        const categoriesData = await categoriesRes.json();
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || [];
        setCategories(categoriesArray);

        const productData = await productRes.json();

        // Converter specifications de objeto para array
        const specsArray = productData.specifications && typeof productData.specifications === 'object'
          ? Object.entries(productData.specifications).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : [];

        form.reset({
          title: productData.title || '',
          slug: productData.slug || '',
          description: productData.description || '',
          category_id: String(productData.category),
          is_active: productData.is_active ?? true,
          specifications: specsArray,
        });
        setImageUrl(productData.image_url || null);

        // Estrutura de variantes e tamanhos
        // Variantes
        const variantList: Variant[] = (productData.variants || []).map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description,
        }));
        setVariants(variantList);

        // Tamanhos: diretos do produto + tamanhos das variantes (com IDs)
        const directSizes: VariantSize[] = (productData.sizes_detail || []).map((s: any) => ({
          id: s.id,
          size_label: s.size_label,
          image_url: s.image_url,
          variant: s.variant,
          product: s.product,
        }));

        const variantSizes: VariantSize[] = (productData.variants || []).flatMap((v: any) =>
          (v.sizes_detail || []).map((s: any) => ({
            id: s.id,
            size_label: s.size_label,
            image_url: s.image_url,
            variant: v.id,
            product: null,
          })),
        );

        setSizes([...directSizes, ...variantSizes]);
      } catch (error: any) {
        console.error('Erro ao carregar dados do produto:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Não foi possível carregar o produto',
          variant: 'destructive',
        });
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (values: ProductEditFormValues) => {
    if (!slug) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const categoryId = parseInt(values.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID de categoria inválido');
      }

      // Converter specifications de array para objeto
      const specsObj: Record<string, string> = {};
      if (values.specifications && values.specifications.length > 0) {
        values.specifications.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        description: values.description || '',
        category: categoryId,
        is_active: values.is_active ?? true,
        specifications: specsObj,
      };

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          (errorData.slug && Array.isArray(errorData.slug) ? errorData.slug[0] : errorData.slug) ||
          (errorData.title && Array.isArray(errorData.title) ? errorData.title[0] : errorData.title) ||
          JSON.stringify(errorData) ||
          'Erro ao atualizar produto';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!slug) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/products/products/${slug}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || JSON.stringify(errorData) || 'Erro ao atualizar imagem';
        throw new Error(errorMessage);
      }

      const updated = await res.json();
      setImageUrl(updated.image_url || null);

      toast({
        title: 'Imagem atualizada',
        description: 'A imagem principal do produto foi atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar imagem do produto',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Produto</h1>
              <p className="text-muted-foreground text-sm">
                Atualize as informações básicas do produto. Estrutura de tamanhos/variantes será ajustada em etapa
                futura.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto</CardTitle>
            <CardDescription>Edite os campos principais do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="slug-do-produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Descrição do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Produto ativo</FormLabel>
                          <CardDescription className="text-xs">
                            Defina se o produto deve aparecer no site público.
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={(checked) => field.onChange(checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              Adicione especificações técnicas do produto (ex: Norma, Material, Pressão)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Material, Norma, Pressão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aço Carbono WCB, ANSI B16.34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeSpec(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSpec({ key: '', value: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Especificação
            </Button>
          </CardContent>
        </Card>

        {/* Imagem principal do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Produto</CardTitle>
            <CardDescription>
              Visualize e altere a imagem principal que aparece na vitrine e na página de detalhes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Imagem do produto" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Nenhuma imagem definida para este produto.
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="product-image">Atualizar imagem</Label>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos recomendados: JPG ou PNG. A imagem será usada na vitrine e nas páginas de detalhes do
                  produto.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estrutura de variantes e tamanhos (somente para visualização/remoção/adição básica) */}
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Variantes e Tamanhos</CardTitle>
            <CardDescription>
              Gerencie variantes e tamanhos deste produto. A criação mantém o fluxo simplificado: nome da variante e
              tamanhos com imagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variantes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Variantes</h3>
                {/* Se existir qualquer tamanho direto (produto intermediário), não permitir adicionar variantes */}
                {sizes.filter((s) => s.variant === null).length === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const name = window.prompt('Nome da nova variante:');
                      if (!name || !slug) return;

                    const run = async () => {
                      try {
                        const token = localStorage.getItem('authToken');
                        if (!token) throw new Error('Não autenticado');

                        const formData = new FormData();
                        formData.append('name', name);

                        const res = await fetch(`${API_BASE}/products/products/${slug}/variants/`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        });

                        if (!res.ok) {
                          const error = await res.json().catch(() => ({}));
                          throw new Error(error.detail || 'Erro ao criar variante');
                        }

                        const created = await res.json();
                        setVariants((prev) => [...prev, { id: created.id, name: created.name }]);
                        toast({ title: 'Variante criada com sucesso' });
                      } catch (error: any) {
                        console.error('Erro ao criar variante:', error);
                        toast({
                          title: 'Erro',
                          description: error.message || 'Erro ao criar variante',
                          variant: 'destructive',
                        });
                      }
                    };

                      run();
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                )}
              </div>

              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          {variant.description && (
                            <p className="text-xs text-muted-foreground">{variant.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!window.confirm(`Remover variante "${variant.name}" e seus tamanhos?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/variants/${variant.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover variante');
                                }

                                setVariants((prev) => prev.filter((v) => v.id !== variant.id));
                                setSizes((prev) => prev.filter((s) => s.variant !== variant.id));
                                toast({ title: 'Variante removida com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover variante:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover variante',
                                  variant: 'destructive',
                                });
                              }
                            };
                            run();
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Tamanhos da variante */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tamanhos</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const sizeLabel = window.prompt('Tamanho (ex: 1/2", 1", 2"):');
                              if (!sizeLabel) return;

                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = () => {
                                if (!input.files || input.files.length === 0) return;
                                const file = input.files[0];

                                const run = async () => {
                                  try {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) throw new Error('Não autenticado');

                                    const formData = new FormData();
                                    formData.append('size_label', sizeLabel);
                                    formData.append('image', file);

                                    const res = await fetch(
                                      `${API_BASE}/products/variants/${variant.id}/sizes/`,
                                      {
                                        method: 'POST',
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: formData,
                                      },
                                    );

                                    if (!res.ok) {
                                      const error = await res.json().catch(() => ({}));
                                      throw new Error(error.detail || 'Erro ao adicionar tamanho');
                                    }

                                    const created = await res.json();
                                    setSizes((prev) => [
                                      ...prev,
                                      {
                                        id: created.id,
                                        size_label: created.size_label,
                                        image_url: created.image_url,
                                        variant: variant.id,
                                        product: null,
                                      },
                                    ]);
                                    toast({ title: 'Tamanho adicionado com sucesso' });
                                  } catch (error: any) {
                                    console.error('Erro ao adicionar tamanho:', error);
                                    toast({
                                      title: 'Erro',
                                      description: error.message || 'Erro ao adicionar tamanho',
                                      variant: 'destructive',
                                    });
                                  }
                                };

                                run();
                              };
                              input.click();
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Adicionar Tamanho
                          </Button>
                        </div>

                        {sizes.filter((s) => s.variant === variant.id).length === 0 ? (
                          <p className="text-xs text-muted-foreground">Nenhum tamanho cadastrado.</p>
                        ) : (
                          <div className="space-y-1">
                            {sizes
                              .filter((s) => s.variant === variant.id)
                              .map((size) => (
                                <div
                                  key={size.id}
                                  className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    {size.image_url && (
                                      <img
                                        src={size.image_url}
                                        alt={size.size_label}
                                        className="h-8 w-8 rounded object-contain bg-muted"
                                      />
                                    )}
                                    <span>{size.size_label}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                                      const run = async () => {
                                        try {
                                          const token = localStorage.getItem('authToken');
                                          if (!token) throw new Error('Não autenticado');

                                          const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                            method: 'DELETE',
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          });

                                          if (!res.ok) {
                                            const error = await res.json().catch(() => ({}));
                                            throw new Error(error.detail || 'Erro ao remover tamanho');
                                          }

                                          setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                          toast({ title: 'Tamanho removido com sucesso' });
                                        } catch (error: any) {
                                          console.error('Erro ao remover tamanho:', error);
                                          toast({
                                            title: 'Erro',
                                            description: error.message || 'Erro ao remover tamanho',
                                            variant: 'destructive',
                                          });
                                        }
                                      };
                                      run();
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tamanhos diretos do produto (sem variante) */}
            {/* Se existir qualquer variante, esconder completamente os tamanhos diretos */}
            {variants.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Tamanhos Diretos (Produto intermediário)</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!slug) return;
                      const sizeLabel = window.prompt('Tamanho (ex: 1/2\", 1\", 2\"):');
                      if (!sizeLabel) return;

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = () => {
                      if (!input.files || input.files.length === 0) return;
                      const file = input.files[0];

                      const run = async () => {
                        try {
                          const token = localStorage.getItem('authToken');
                          if (!token) throw new Error('Não autenticado');

                          const formData = new FormData();
                          formData.append('size_label', sizeLabel);
                          formData.append('image', file);

                          const res = await fetch(`${API_BASE}/products/products/${slug}/sizes/`, {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) {
                            const error = await res.json().catch(() => ({}));
                            throw new Error(error.detail || 'Erro ao adicionar tamanho');
                          }

                          const created = await res.json();
                          setSizes((prev) => [
                            ...prev,
                            {
                              id: created.id,
                              size_label: created.size_label,
                              image_url: created.image_url,
                              variant: null,
                              product: created.product,
                            },
                          ]);
                          toast({ title: 'Tamanho adicionado com sucesso' });
                        } catch (error: any) {
                          console.error('Erro ao adicionar tamanho:', error);
                          toast({
                            title: 'Erro',
                            description: error.message || 'Erro ao adicionar tamanho',
                            variant: 'destructive',
                          });
                        }
                      };

                      run();
                    };
                    input.click();
                  }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </div>

                {sizes.filter((s) => s.variant === null).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum tamanho direto cadastrado.</p>
                ) : (
                  <div className="space-y-1">
                    {sizes
                      .filter((s) => s.variant === null)
                      .map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {size.image_url && (
                              <img
                                src={size.image_url}
                                alt={size.size_label}
                                className="h-8 w-8 rounded object-contain bg-muted"
                              />
                            )}
                            <span>{size.size_label}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                            if (!window.confirm(`Remover tamanho "${size.size_label}"?`)) return;
                            const run = async () => {
                              try {
                                const token = localStorage.getItem('authToken');
                                if (!token) throw new Error('Não autenticado');

                                const res = await fetch(`${API_BASE}/products/sizes/${size.id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });

                                if (!res.ok) {
                                  const error = await res.json().catch(() => ({}));
                                  throw new Error(error.detail || 'Erro ao remover tamanho');
                                }

                                setSizes((prev) => prev.filter((s) => s.id !== size.id));
                                toast({ title: 'Tamanho removido com sucesso' });
                              } catch (error: any) {
                                console.error('Erro ao remover tamanho:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message || 'Erro ao remover tamanho',
                                  variant: 'destructive',
                                });
                              }
                            };
                              run();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}


