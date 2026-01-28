import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

// Schema de validação
const productFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  structure_type: z.enum(['simple', 'intermediate', 'complex'], {
    required_error: 'Selecione o tipo de estrutura',
  }),
  cover_image: z.union([z.instanceof(File), z.undefined()]).optional(),
  
  // Para produtos intermediários (com tamanhos diretos)
  sizes: z.array(
    z.object({
      size_label: z.string().min(1, 'Tamanho é obrigatório'),
      image: z.union([z.instanceof(File), z.undefined()]),
    })
  ).optional(),
  
  // Para produtos complexos (com variantes)
  variants: z.array(
    z.object({
      name: z.string().min(1, 'Nome da variante é obrigatório'),
      description: z.string().optional(),
      image: z.union([z.instanceof(File), z.undefined()]).optional(),
      sizes: z.array(
        z.object({
          size_label: z.string().min(1, 'Tamanho é obrigatório'),
          image: z.union([z.instanceof(File), z.undefined()]),
        })
      ),
    })
  ).optional(),
  
  // Especificações técnicas (Key-Value)
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
}).refine(
  (data) => {
    if (data.structure_type === 'simple' && !data.cover_image) {
      return false;
    }
    if (data.structure_type === 'intermediate' && (!data.sizes || data.sizes.length === 0)) {
      return false;
    }
    if (data.structure_type === 'complex' && (!data.variants || data.variants.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Preencha todos os campos obrigatórios para o tipo selecionado',
    path: ['structure_type'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'intermediate' && data.sizes) {
      return data.sizes.every(size => size.image instanceof File);
    }
    return true;
  },
  {
    message: 'Todos os tamanhos devem ter uma imagem',
    path: ['sizes'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'complex' && data.variants) {
      return data.variants.every(variant => 
        variant.sizes.every(size => size.image instanceof File)
      );
    }
    return true;
  },
  {
    message: 'Todos os tamanhos das variantes devem ter uma imagem',
    path: ['variants'],
  }
);

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProductsNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      structure_type: 'simple',
      cover_image: undefined,
      sizes: [] as Array<{ size_label: string; image: File | undefined }>,
      variants: [] as Array<{
        name: string;
        description?: string;
        image?: File;
        sizes: Array<{ size_label: string; image: File | undefined }>;
      }>,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  const structureType = form.watch('structure_type');
  const title = form.watch('title');

  // Gerar slug automaticamente baseado no título
  useEffect(() => {
    if (title && !form.getValues('slug')) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [title, form]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/categories/`);
        if (res.ok) {
          const data = await res.json();
          // Garantir que sempre seja um array
          const categoriesArray = Array.isArray(data) ? data : (data.results || []);
          setCategories(categoriesArray);
        } else {
          // Se a resposta não for OK, definir array vazio
          setCategories([]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, garantir que seja um array vazio
        setCategories([]);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // Field arrays
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: 'sizes',
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      // 1. Criar produto básico usando FormData para incluir imagem
      const productFormData = new FormData();
      productFormData.append('title', data.title);
      
      // Slug é opcional, o backend gera automaticamente se não fornecido
      if (data.slug && data.slug.trim()) {
        productFormData.append('slug', data.slug.trim());
      }
      
      productFormData.append('description', data.description || '');
      
      // Category deve ser o ID numérico
      const categoryId = parseInt(data.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID da categoria inválido');
      }
      productFormData.append('category', categoryId.toString());
      
      if (data.cover_image) {
        productFormData.append('image', data.cover_image);
      }
      
      // Adicionar especificações técnicas como JSON
      if (data.specifications && data.specifications.length > 0) {
        const specsObj: Record<string, string> = {};
        data.specifications.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
        productFormData.append('specifications', JSON.stringify(specsObj));
      }
      
      console.log('Criando produto:', {
        title: data.title,
        slug: data.slug,
        category: categoryId,
        hasImage: !!data.cover_image,
        structureType: data.structure_type
      });

      const productRes = await fetch(`${API_BASE}/products/products/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productFormData,
      });

      if (!productRes.ok) {
        let errorData;
        try {
          errorData = await productRes.json();
        } catch {
          errorData = { detail: `Erro HTTP ${productRes.status}: ${productRes.statusText}` };
        }
        
        console.error('Erro ao criar produto:', errorData);
        
        // Extrair mensagem de erro mais específica
        let errorMessage = 
          errorData.detail ||
          errorData.message;
        
        // Tratar erros de campo não específicos (non_field_errors)
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          const nonFieldError = errorData.non_field_errors[0];
          // Traduzir mensagem de unicidade para português mais amigável
          if (nonFieldError.includes('category') && nonFieldError.includes('slug') && nonFieldError.includes('único')) {
            errorMessage = `Já existe um produto com este slug na categoria selecionada. Por favor, altere o slug ou escolha outra categoria.`;
          } else {
            errorMessage = nonFieldError;
          }
        }
        
        // Tratar erros de campos específicos
        if (!errorMessage) {
          if (errorData.title && Array.isArray(errorData.title)) {
            errorMessage = `Título: ${errorData.title[0]}`;
          } else if (errorData.category && Array.isArray(errorData.category)) {
            errorMessage = `Categoria: ${errorData.category[0]}`;
          } else if (errorData.slug && Array.isArray(errorData.slug)) {
            errorMessage = `Slug: ${errorData.slug[0]}`;
          } else if (errorData.description && Array.isArray(errorData.description)) {
            errorMessage = `Descrição: ${errorData.description[0]}`;
          }
        }
        
        // Se ainda não tiver mensagem, usar JSON ou status
        if (!errorMessage) {
          errorMessage = JSON.stringify(errorData) || `Erro ${productRes.status}: ${productRes.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const product = await productRes.json();
      const productSlug = product.slug;

      // 2. Processar conforme o tipo de estrutura
      if (data.structure_type === 'intermediate' && data.sizes) {
        // Criar tamanhos diretos do produto
        for (const size of data.sizes) {
          const sizeFormData = new FormData();
          sizeFormData.append('size_label', size.size_label);
          sizeFormData.append('image', size.image);
          sizeFormData.append('product', product.id.toString());

          const sizeRes = await fetch(`${API_BASE}/products/products/${productSlug}/sizes/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: sizeFormData,
          });

          if (!sizeRes.ok) {
            const error = await sizeRes.json().catch(() => ({}));
            console.warn(`Erro ao criar tamanho ${size.size_label}:`, error);
          }
        }
      } else if (data.structure_type === 'complex' && data.variants) {
        // Criar variantes e seus tamanhos
        for (const variant of data.variants) {
          // Criar variante
          const variantFormData = new FormData();
          variantFormData.append('name', variant.name);
          variantFormData.append('description', variant.description || '');
          variantFormData.append('product', product.id.toString());
          
          if (variant.image) {
            variantFormData.append('image', variant.image);
          }

          const variantRes = await fetch(`${API_BASE}/products/products/${productSlug}/variants/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: variantFormData,
          });

          if (!variantRes.ok) {
            const error = await variantRes.json().catch(() => ({}));
            console.warn(`Erro ao criar variante ${variant.name}:`, error);
            continue;
          }

          const createdVariant = await variantRes.json();
          const variantId = createdVariant.id;

          // Criar tamanhos da variante
          for (const size of variant.sizes) {
            const sizeFormData = new FormData();
            sizeFormData.append('size_label', size.size_label);
            sizeFormData.append('image', size.image);
            sizeFormData.append('variant', variantId.toString());

            const sizeRes = await fetch(`${API_BASE}/products/variants/${variantId}/sizes/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: sizeFormData,
            });

            if (!sizeRes.ok) {
              const error = await sizeRes.json().catch(() => ({}));
              console.warn(`Erro ao criar tamanho ${size.size_label} da variante ${variant.name}:`, error);
            }
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro completo ao criar produto:', error);
      const errorMessage = error.message || 'Erro desconhecido ao criar produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Garantir que os arrays estejam sempre inicializados
  const safeSizeFields = Array.isArray(sizeFields) ? sizeFields : [];
  const safeVariantFields = Array.isArray(variantFields) ? variantFields : [];

  return (
    <>
      <Helmet>
        <title>Novo Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados do produto abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do produto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Válvula de Esfera" {...field} />
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
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="valvula-esfera" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL amigável (gerada automaticamente)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o produto..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {loadingCategories ? 'Carregando...' : 'Nenhuma categoria disponível'}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tipo de Estrutura */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Estrutura</CardTitle>
                <CardDescription>
                  Selecione como o produto será organizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="structure_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="simple" id="simple" />
                            <Label htmlFor="simple" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Simples</div>
                                <div className="text-sm text-muted-foreground">
                                  Apenas imagem de capa
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Tamanhos</div>
                                <div className="text-sm text-muted-foreground">
                                  Tamanhos diretos do produto
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complex" id="complex" />
                            <Label htmlFor="complex" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Variantes</div>
                                <div className="text-sm text-muted-foreground">
                                  Variantes com tamanhos
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Imagem de Capa (Simples) */}
            {structureType === 'simple' && (
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Capa *</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tamanhos (Intermediário) */}
            {structureType === 'intermediate' && (
              <Card>
                <CardHeader>
                  <CardTitle>Tamanhos</CardTitle>
                  <CardDescription>
                    Adicione os tamanhos disponíveis do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safeSizeFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.size_label`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tamanho *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 1/2, 1, 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Imagem *</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
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
                          onClick={() => removeSize(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSize({ size_label: '', image: undefined as any })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Variantes (Complexo) */}
            {structureType === 'complex' && (
              <Card>
                <CardHeader>
                  <CardTitle>Variantes</CardTitle>
                  <CardDescription>
                    Adicione as variantes do produto com seus tamanhos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {safeVariantFields.map((variant, variantIndex) => (
                    <Card key={variant.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Nome da Variante *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Tripartida 300#" {...field} />
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
                            onClick={() => removeVariant(variantIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descrição da variante..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Imagem da Variante (opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tamanhos da Variante */}
                        <div className="space-y-2">
                          <Label>Tamanhos da Variante</Label>
                          {(form.watch(`variants.${variantIndex}.sizes`) || []).map((_, sizeIndex) => (
                            <div key={sizeIndex} className="flex gap-2 items-end">
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.size_label`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="Tamanho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.image`}
                                render={({ field: { value, onChange, ...field } }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          onChange(file);
                                        }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(
                                `variants.${variantIndex}.sizes`,
                                currentSizes.filter((_, i) => i !== sizeIndex)
                              );
                            }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(`variants.${variantIndex}.sizes`, [
                                ...(Array.isArray(currentSizes) ? currentSizes : []),
                                { size_label: '', image: undefined as any },
                              ]);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Tamanho
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendVariant({
                        name: '',
                        description: '',
                        image: undefined,
                        sizes: [],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                </CardContent>
              </Card>
            )}

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

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Salvar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}


import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

// Schema de validação
const productFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  structure_type: z.enum(['simple', 'intermediate', 'complex'], {
    required_error: 'Selecione o tipo de estrutura',
  }),
  cover_image: z.union([z.instanceof(File), z.undefined()]).optional(),
  
  // Para produtos intermediários (com tamanhos diretos)
  sizes: z.array(
    z.object({
      size_label: z.string().min(1, 'Tamanho é obrigatório'),
      image: z.union([z.instanceof(File), z.undefined()]),
    })
  ).optional(),
  
  // Para produtos complexos (com variantes)
  variants: z.array(
    z.object({
      name: z.string().min(1, 'Nome da variante é obrigatório'),
      description: z.string().optional(),
      image: z.union([z.instanceof(File), z.undefined()]).optional(),
      sizes: z.array(
        z.object({
          size_label: z.string().min(1, 'Tamanho é obrigatório'),
          image: z.union([z.instanceof(File), z.undefined()]),
        })
      ),
    })
  ).optional(),
  
  // Especificações técnicas (Key-Value)
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
}).refine(
  (data) => {
    if (data.structure_type === 'simple' && !data.cover_image) {
      return false;
    }
    if (data.structure_type === 'intermediate' && (!data.sizes || data.sizes.length === 0)) {
      return false;
    }
    if (data.structure_type === 'complex' && (!data.variants || data.variants.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Preencha todos os campos obrigatórios para o tipo selecionado',
    path: ['structure_type'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'intermediate' && data.sizes) {
      return data.sizes.every(size => size.image instanceof File);
    }
    return true;
  },
  {
    message: 'Todos os tamanhos devem ter uma imagem',
    path: ['sizes'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'complex' && data.variants) {
      return data.variants.every(variant => 
        variant.sizes.every(size => size.image instanceof File)
      );
    }
    return true;
  },
  {
    message: 'Todos os tamanhos das variantes devem ter uma imagem',
    path: ['variants'],
  }
);

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProductsNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      structure_type: 'simple',
      cover_image: undefined,
      sizes: [] as Array<{ size_label: string; image: File | undefined }>,
      variants: [] as Array<{
        name: string;
        description?: string;
        image?: File;
        sizes: Array<{ size_label: string; image: File | undefined }>;
      }>,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  const structureType = form.watch('structure_type');
  const title = form.watch('title');

  // Gerar slug automaticamente baseado no título
  useEffect(() => {
    if (title && !form.getValues('slug')) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [title, form]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/categories/`);
        if (res.ok) {
          const data = await res.json();
          // Garantir que sempre seja um array
          const categoriesArray = Array.isArray(data) ? data : (data.results || []);
          setCategories(categoriesArray);
        } else {
          // Se a resposta não for OK, definir array vazio
          setCategories([]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, garantir que seja um array vazio
        setCategories([]);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // Field arrays
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: 'sizes',
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      // 1. Criar produto básico usando FormData para incluir imagem
      const productFormData = new FormData();
      productFormData.append('title', data.title);
      
      // Slug é opcional, o backend gera automaticamente se não fornecido
      if (data.slug && data.slug.trim()) {
        productFormData.append('slug', data.slug.trim());
      }
      
      productFormData.append('description', data.description || '');
      
      // Category deve ser o ID numérico
      const categoryId = parseInt(data.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID da categoria inválido');
      }
      productFormData.append('category', categoryId.toString());
      
      if (data.cover_image) {
        productFormData.append('image', data.cover_image);
      }
      
      // Adicionar especificações técnicas como JSON
      if (data.specifications && data.specifications.length > 0) {
        const specsObj: Record<string, string> = {};
        data.specifications.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
        productFormData.append('specifications', JSON.stringify(specsObj));
      }
      
      console.log('Criando produto:', {
        title: data.title,
        slug: data.slug,
        category: categoryId,
        hasImage: !!data.cover_image,
        structureType: data.structure_type
      });

      const productRes = await fetch(`${API_BASE}/products/products/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productFormData,
      });

      if (!productRes.ok) {
        let errorData;
        try {
          errorData = await productRes.json();
        } catch {
          errorData = { detail: `Erro HTTP ${productRes.status}: ${productRes.statusText}` };
        }
        
        console.error('Erro ao criar produto:', errorData);
        
        // Extrair mensagem de erro mais específica
        let errorMessage = 
          errorData.detail ||
          errorData.message;
        
        // Tratar erros de campo não específicos (non_field_errors)
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          const nonFieldError = errorData.non_field_errors[0];
          // Traduzir mensagem de unicidade para português mais amigável
          if (nonFieldError.includes('category') && nonFieldError.includes('slug') && nonFieldError.includes('único')) {
            errorMessage = `Já existe um produto com este slug na categoria selecionada. Por favor, altere o slug ou escolha outra categoria.`;
          } else {
            errorMessage = nonFieldError;
          }
        }
        
        // Tratar erros de campos específicos
        if (!errorMessage) {
          if (errorData.title && Array.isArray(errorData.title)) {
            errorMessage = `Título: ${errorData.title[0]}`;
          } else if (errorData.category && Array.isArray(errorData.category)) {
            errorMessage = `Categoria: ${errorData.category[0]}`;
          } else if (errorData.slug && Array.isArray(errorData.slug)) {
            errorMessage = `Slug: ${errorData.slug[0]}`;
          } else if (errorData.description && Array.isArray(errorData.description)) {
            errorMessage = `Descrição: ${errorData.description[0]}`;
          }
        }
        
        // Se ainda não tiver mensagem, usar JSON ou status
        if (!errorMessage) {
          errorMessage = JSON.stringify(errorData) || `Erro ${productRes.status}: ${productRes.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const product = await productRes.json();
      const productSlug = product.slug;

      // 2. Processar conforme o tipo de estrutura
      if (data.structure_type === 'intermediate' && data.sizes) {
        // Criar tamanhos diretos do produto
        for (const size of data.sizes) {
          const sizeFormData = new FormData();
          sizeFormData.append('size_label', size.size_label);
          sizeFormData.append('image', size.image);
          sizeFormData.append('product', product.id.toString());

          const sizeRes = await fetch(`${API_BASE}/products/products/${productSlug}/sizes/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: sizeFormData,
          });

          if (!sizeRes.ok) {
            const error = await sizeRes.json().catch(() => ({}));
            console.warn(`Erro ao criar tamanho ${size.size_label}:`, error);
          }
        }
      } else if (data.structure_type === 'complex' && data.variants) {
        // Criar variantes e seus tamanhos
        for (const variant of data.variants) {
          // Criar variante
          const variantFormData = new FormData();
          variantFormData.append('name', variant.name);
          variantFormData.append('description', variant.description || '');
          variantFormData.append('product', product.id.toString());
          
          if (variant.image) {
            variantFormData.append('image', variant.image);
          }

          const variantRes = await fetch(`${API_BASE}/products/products/${productSlug}/variants/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: variantFormData,
          });

          if (!variantRes.ok) {
            const error = await variantRes.json().catch(() => ({}));
            console.warn(`Erro ao criar variante ${variant.name}:`, error);
            continue;
          }

          const createdVariant = await variantRes.json();
          const variantId = createdVariant.id;

          // Criar tamanhos da variante
          for (const size of variant.sizes) {
            const sizeFormData = new FormData();
            sizeFormData.append('size_label', size.size_label);
            sizeFormData.append('image', size.image);
            sizeFormData.append('variant', variantId.toString());

            const sizeRes = await fetch(`${API_BASE}/products/variants/${variantId}/sizes/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: sizeFormData,
            });

            if (!sizeRes.ok) {
              const error = await sizeRes.json().catch(() => ({}));
              console.warn(`Erro ao criar tamanho ${size.size_label} da variante ${variant.name}:`, error);
            }
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro completo ao criar produto:', error);
      const errorMessage = error.message || 'Erro desconhecido ao criar produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Garantir que os arrays estejam sempre inicializados
  const safeSizeFields = Array.isArray(sizeFields) ? sizeFields : [];
  const safeVariantFields = Array.isArray(variantFields) ? variantFields : [];

  return (
    <>
      <Helmet>
        <title>Novo Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados do produto abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do produto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Válvula de Esfera" {...field} />
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
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="valvula-esfera" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL amigável (gerada automaticamente)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o produto..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {loadingCategories ? 'Carregando...' : 'Nenhuma categoria disponível'}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tipo de Estrutura */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Estrutura</CardTitle>
                <CardDescription>
                  Selecione como o produto será organizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="structure_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="simple" id="simple" />
                            <Label htmlFor="simple" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Simples</div>
                                <div className="text-sm text-muted-foreground">
                                  Apenas imagem de capa
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Tamanhos</div>
                                <div className="text-sm text-muted-foreground">
                                  Tamanhos diretos do produto
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complex" id="complex" />
                            <Label htmlFor="complex" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Variantes</div>
                                <div className="text-sm text-muted-foreground">
                                  Variantes com tamanhos
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Imagem de Capa (Simples) */}
            {structureType === 'simple' && (
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Capa *</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tamanhos (Intermediário) */}
            {structureType === 'intermediate' && (
              <Card>
                <CardHeader>
                  <CardTitle>Tamanhos</CardTitle>
                  <CardDescription>
                    Adicione os tamanhos disponíveis do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safeSizeFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.size_label`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tamanho *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 1/2, 1, 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Imagem *</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
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
                          onClick={() => removeSize(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSize({ size_label: '', image: undefined as any })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Variantes (Complexo) */}
            {structureType === 'complex' && (
              <Card>
                <CardHeader>
                  <CardTitle>Variantes</CardTitle>
                  <CardDescription>
                    Adicione as variantes do produto com seus tamanhos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {safeVariantFields.map((variant, variantIndex) => (
                    <Card key={variant.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Nome da Variante *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Tripartida 300#" {...field} />
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
                            onClick={() => removeVariant(variantIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descrição da variante..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Imagem da Variante (opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tamanhos da Variante */}
                        <div className="space-y-2">
                          <Label>Tamanhos da Variante</Label>
                          {(form.watch(`variants.${variantIndex}.sizes`) || []).map((_, sizeIndex) => (
                            <div key={sizeIndex} className="flex gap-2 items-end">
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.size_label`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="Tamanho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.image`}
                                render={({ field: { value, onChange, ...field } }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          onChange(file);
                                        }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(
                                `variants.${variantIndex}.sizes`,
                                currentSizes.filter((_, i) => i !== sizeIndex)
                              );
                            }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(`variants.${variantIndex}.sizes`, [
                                ...(Array.isArray(currentSizes) ? currentSizes : []),
                                { size_label: '', image: undefined as any },
                              ]);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Tamanho
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendVariant({
                        name: '',
                        description: '',
                        image: undefined,
                        sizes: [],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                </CardContent>
              </Card>
            )}

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

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Salvar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}


import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// API_BASE
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

// Schema de validação
const productFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  structure_type: z.enum(['simple', 'intermediate', 'complex'], {
    required_error: 'Selecione o tipo de estrutura',
  }),
  cover_image: z.union([z.instanceof(File), z.undefined()]).optional(),
  
  // Para produtos intermediários (com tamanhos diretos)
  sizes: z.array(
    z.object({
      size_label: z.string().min(1, 'Tamanho é obrigatório'),
      image: z.union([z.instanceof(File), z.undefined()]),
    })
  ).optional(),
  
  // Para produtos complexos (com variantes)
  variants: z.array(
    z.object({
      name: z.string().min(1, 'Nome da variante é obrigatório'),
      description: z.string().optional(),
      image: z.union([z.instanceof(File), z.undefined()]).optional(),
      sizes: z.array(
        z.object({
          size_label: z.string().min(1, 'Tamanho é obrigatório'),
          image: z.union([z.instanceof(File), z.undefined()]),
        })
      ),
    })
  ).optional(),
  
  // Especificações técnicas (Key-Value)
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Nome da especificação é obrigatório'),
      value: z.string().min(1, 'Valor da especificação é obrigatório'),
    })
  ).optional(),
}).refine(
  (data) => {
    if (data.structure_type === 'simple' && !data.cover_image) {
      return false;
    }
    if (data.structure_type === 'intermediate' && (!data.sizes || data.sizes.length === 0)) {
      return false;
    }
    if (data.structure_type === 'complex' && (!data.variants || data.variants.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Preencha todos os campos obrigatórios para o tipo selecionado',
    path: ['structure_type'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'intermediate' && data.sizes) {
      return data.sizes.every(size => size.image instanceof File);
    }
    return true;
  },
  {
    message: 'Todos os tamanhos devem ter uma imagem',
    path: ['sizes'],
  }
).refine(
  (data) => {
    if (data.structure_type === 'complex' && data.variants) {
      return data.variants.every(variant => 
        variant.sizes.every(size => size.image instanceof File)
      );
    }
    return true;
  },
  {
    message: 'Todos os tamanhos das variantes devem ter uma imagem',
    path: ['variants'],
  }
);

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProductsNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category_id: '',
      structure_type: 'simple',
      cover_image: undefined,
      sizes: [] as Array<{ size_label: string; image: File | undefined }>,
      variants: [] as Array<{
        name: string;
        description?: string;
        image?: File;
        sizes: Array<{ size_label: string; image: File | undefined }>;
      }>,
      specifications: [] as Array<{ key: string; value: string }>,
    },
  });

  const structureType = form.watch('structure_type');
  const title = form.watch('title');

  // Gerar slug automaticamente baseado no título
  useEffect(() => {
    if (title && !form.getValues('slug')) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [title, form]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/categories/`);
        if (res.ok) {
          const data = await res.json();
          // Garantir que sempre seja um array
          const categoriesArray = Array.isArray(data) ? data : (data.results || []);
          setCategories(categoriesArray);
        } else {
          // Se a resposta não for OK, definir array vazio
          setCategories([]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, garantir que seja um array vazio
        setCategories([]);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // Field arrays
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: 'sizes',
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Não autenticado');
      }

      // 1. Criar produto básico usando FormData para incluir imagem
      const productFormData = new FormData();
      productFormData.append('title', data.title);
      
      // Slug é opcional, o backend gera automaticamente se não fornecido
      if (data.slug && data.slug.trim()) {
        productFormData.append('slug', data.slug.trim());
      }
      
      productFormData.append('description', data.description || '');
      
      // Category deve ser o ID numérico
      const categoryId = parseInt(data.category_id, 10);
      if (isNaN(categoryId)) {
        throw new Error('ID da categoria inválido');
      }
      productFormData.append('category', categoryId.toString());
      
      if (data.cover_image) {
        productFormData.append('image', data.cover_image);
      }
      
      // Adicionar especificações técnicas como JSON
      if (data.specifications && data.specifications.length > 0) {
        const specsObj: Record<string, string> = {};
        data.specifications.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
        productFormData.append('specifications', JSON.stringify(specsObj));
      }
      
      console.log('Criando produto:', {
        title: data.title,
        slug: data.slug,
        category: categoryId,
        hasImage: !!data.cover_image,
        structureType: data.structure_type
      });

      const productRes = await fetch(`${API_BASE}/products/products/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productFormData,
      });

      if (!productRes.ok) {
        let errorData;
        try {
          errorData = await productRes.json();
        } catch {
          errorData = { detail: `Erro HTTP ${productRes.status}: ${productRes.statusText}` };
        }
        
        console.error('Erro ao criar produto:', errorData);
        
        // Extrair mensagem de erro mais específica
        let errorMessage = 
          errorData.detail ||
          errorData.message;
        
        // Tratar erros de campo não específicos (non_field_errors)
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          const nonFieldError = errorData.non_field_errors[0];
          // Traduzir mensagem de unicidade para português mais amigável
          if (nonFieldError.includes('category') && nonFieldError.includes('slug') && nonFieldError.includes('único')) {
            errorMessage = `Já existe um produto com este slug na categoria selecionada. Por favor, altere o slug ou escolha outra categoria.`;
          } else {
            errorMessage = nonFieldError;
          }
        }
        
        // Tratar erros de campos específicos
        if (!errorMessage) {
          if (errorData.title && Array.isArray(errorData.title)) {
            errorMessage = `Título: ${errorData.title[0]}`;
          } else if (errorData.category && Array.isArray(errorData.category)) {
            errorMessage = `Categoria: ${errorData.category[0]}`;
          } else if (errorData.slug && Array.isArray(errorData.slug)) {
            errorMessage = `Slug: ${errorData.slug[0]}`;
          } else if (errorData.description && Array.isArray(errorData.description)) {
            errorMessage = `Descrição: ${errorData.description[0]}`;
          }
        }
        
        // Se ainda não tiver mensagem, usar JSON ou status
        if (!errorMessage) {
          errorMessage = JSON.stringify(errorData) || `Erro ${productRes.status}: ${productRes.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const product = await productRes.json();
      const productSlug = product.slug;

      // 2. Processar conforme o tipo de estrutura
      if (data.structure_type === 'intermediate' && data.sizes) {
        // Criar tamanhos diretos do produto
        for (const size of data.sizes) {
          const sizeFormData = new FormData();
          sizeFormData.append('size_label', size.size_label);
          sizeFormData.append('image', size.image);
          sizeFormData.append('product', product.id.toString());

          const sizeRes = await fetch(`${API_BASE}/products/products/${productSlug}/sizes/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: sizeFormData,
          });

          if (!sizeRes.ok) {
            const error = await sizeRes.json().catch(() => ({}));
            console.warn(`Erro ao criar tamanho ${size.size_label}:`, error);
          }
        }
      } else if (data.structure_type === 'complex' && data.variants) {
        // Criar variantes e seus tamanhos
        for (const variant of data.variants) {
          // Criar variante
          const variantFormData = new FormData();
          variantFormData.append('name', variant.name);
          variantFormData.append('description', variant.description || '');
          variantFormData.append('product', product.id.toString());
          
          if (variant.image) {
            variantFormData.append('image', variant.image);
          }

          const variantRes = await fetch(`${API_BASE}/products/products/${productSlug}/variants/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: variantFormData,
          });

          if (!variantRes.ok) {
            const error = await variantRes.json().catch(() => ({}));
            console.warn(`Erro ao criar variante ${variant.name}:`, error);
            continue;
          }

          const createdVariant = await variantRes.json();
          const variantId = createdVariant.id;

          // Criar tamanhos da variante
          for (const size of variant.sizes) {
            const sizeFormData = new FormData();
            sizeFormData.append('size_label', size.size_label);
            sizeFormData.append('image', size.image);
            sizeFormData.append('variant', variantId.toString());

            const sizeRes = await fetch(`${API_BASE}/products/variants/${variantId}/sizes/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: sizeFormData,
            });

            if (!sizeRes.ok) {
              const error = await sizeRes.json().catch(() => ({}));
              console.warn(`Erro ao criar tamanho ${size.size_label} da variante ${variant.name}:`, error);
            }
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso',
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro completo ao criar produto:', error);
      const errorMessage = error.message || 'Erro desconhecido ao criar produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Garantir que os arrays estejam sempre inicializados
  const safeSizeFields = Array.isArray(sizeFields) ? sizeFields : [];
  const safeVariantFields = Array.isArray(variantFields) ? variantFields : [];

  return (
    <>
      <Helmet>
        <title>Novo Produto - Admin | Nexus Válvulas</title>
      </Helmet>

      <div className="py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados do produto abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do produto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Válvula de Esfera" {...field} />
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
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="valvula-esfera" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL amigável (gerada automaticamente)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o produto..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {loadingCategories ? 'Carregando...' : 'Nenhuma categoria disponível'}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tipo de Estrutura */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Estrutura</CardTitle>
                <CardDescription>
                  Selecione como o produto será organizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="structure_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="simple" id="simple" />
                            <Label htmlFor="simple" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Simples</div>
                                <div className="text-sm text-muted-foreground">
                                  Apenas imagem de capa
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Tamanhos</div>
                                <div className="text-sm text-muted-foreground">
                                  Tamanhos diretos do produto
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complex" id="complex" />
                            <Label htmlFor="complex" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Com Variantes</div>
                                <div className="text-sm text-muted-foreground">
                                  Variantes com tamanhos
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Imagem de Capa (Simples) */}
            {structureType === 'simple' && (
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Capa *</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tamanhos (Intermediário) */}
            {structureType === 'intermediate' && (
              <Card>
                <CardHeader>
                  <CardTitle>Tamanhos</CardTitle>
                  <CardDescription>
                    Adicione os tamanhos disponíveis do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safeSizeFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.size_label`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tamanho *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 1/2, 1, 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sizes.${index}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Imagem *</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
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
                          onClick={() => removeSize(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSize({ size_label: '', image: undefined as any })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Tamanho
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Variantes (Complexo) */}
            {structureType === 'complex' && (
              <Card>
                <CardHeader>
                  <CardTitle>Variantes</CardTitle>
                  <CardDescription>
                    Adicione as variantes do produto com seus tamanhos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {safeVariantFields.map((variant, variantIndex) => (
                    <Card key={variant.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Nome da Variante *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Tripartida 300#" {...field} />
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
                            onClick={() => removeVariant(variantIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descrição da variante..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Imagem da Variante (opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tamanhos da Variante */}
                        <div className="space-y-2">
                          <Label>Tamanhos da Variante</Label>
                          {(form.watch(`variants.${variantIndex}.sizes`) || []).map((_, sizeIndex) => (
                            <div key={sizeIndex} className="flex gap-2 items-end">
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.size_label`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="Tamanho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sizes.${sizeIndex}.image`}
                                render={({ field: { value, onChange, ...field } }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          onChange(file);
                                        }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(
                                `variants.${variantIndex}.sizes`,
                                currentSizes.filter((_, i) => i !== sizeIndex)
                              );
                            }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentSizes = form.getValues(`variants.${variantIndex}.sizes`) || [];
                              form.setValue(`variants.${variantIndex}.sizes`, [
                                ...(Array.isArray(currentSizes) ? currentSizes : []),
                                { size_label: '', image: undefined as any },
                              ]);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Tamanho
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendVariant({
                        name: '',
                        description: '',
                        image: undefined,
                        sizes: [],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Variante
                  </Button>
                </CardContent>
              </Card>
            )}

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

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Salvar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

