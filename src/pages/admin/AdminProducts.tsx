import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import { DraggableVariantList } from '@/components/admin/DraggableVariantList';

export default function AdminProducts() {
  const { products, loading, refetch } = useProducts();
  const { categories } = useCategories();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    images: '',
    pdfs: ''
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [variantSubmitting, setVariantSubmitting] = useState(false);
  const [newVariant, setNewVariant] = useState<{ type: string; size: string; drawingFile: File | null }>({
    type: '',
    size: '',
    drawingFile: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const uploadedImageUrls: string[] = [];
      const uploadedPdfUrls: string[] = [];

      // Upload de imagens (se houver)
      if (imageFiles && imageFiles.length > 0) {
        for (const file of Array.from(imageFiles)) {
          const filePath = `${formData.slug}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, { upsert: false });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          uploadedImageUrls.push(data.publicUrl);
        }
      }

      // Upload de PDFs (se houver)
      if (pdfFiles && pdfFiles.length > 0) {
        for (const file of Array.from(pdfFiles)) {
          const filePath = `${formData.slug}/pdfs/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, { upsert: false });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          uploadedPdfUrls.push(data.publicUrl);
        }
      }

      const imageUrls = [
        ...uploadedImageUrls,
        ...(formData.images ? formData.images.split(',').map(url => url.trim()).filter(Boolean) : [])
      ];
      const pdfUrls = [
        ...uploadedPdfUrls,
        ...(formData.pdfs ? formData.pdfs.split(',').map(url => url.trim()).filter(Boolean) : [])
      ];

      const coreProduct = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category_id: formData.category_id,
      };

      let productId = editingProduct?.id as string | undefined;

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(coreProduct)
          .eq('id', editingProduct.id);
        if (error) throw error;

        // Substitui imagens/pdfs
        await supabase.from('product_images').delete().eq('product_id', editingProduct.id);
        await supabase.from('product_pdfs').delete().eq('product_id', editingProduct.id);
        productId = editingProduct.id;
        toast({ title: 'Produto atualizado com sucesso!' });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(coreProduct)
          .select('id')
          .single();
        if (error) throw error;
        productId = data.id as string;
        toast({ title: 'Produto criado com sucesso!' });
      }

      // Insere imagens/pdfs normalizados, mantendo ordem
      if (productId) {
        if (imageUrls.length > 0) {
          const imagesRows = imageUrls.map((url, idx) => ({ product_id: productId, url, position: idx }));
          const { error: imgErr } = await supabase.from('product_images').insert(imagesRows);
          if (imgErr) throw imgErr;
        }
        if (pdfUrls.length > 0) {
          const pdfRows = pdfUrls.map((url, idx) => ({ product_id: productId, url, position: idx }));
          const { error: pdfErr } = await supabase.from('product_pdfs').insert(pdfRows);
          if (pdfErr) throw pdfErr;
        }
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setFormData({ title: '', slug: '', description: '', category_id: '', images: '', pdfs: '' });
      setImageFiles(null);
      setPdfFiles(null);
      setVariants([]);
      refetch();
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loadVariants = async (productId: string) => {
    const { data, error } = await supabase
      .from('variants')
      .select('*')
      .eq('product_id', productId)
      .order('position')
      .order('type')
      .order('size');
    if (!error) setVariants(data || []);
  };

  const handleAddVariant = async () => {
    if (!editingProduct) return;
    if (!newVariant.type || !newVariant.size) {
      toast({ title: 'Preencha tipo e tamanho', variant: 'destructive' });
      return;
    }
    try {
      setVariantSubmitting(true);
      let drawingUrl: string | null = null;
      if (newVariant.drawingFile) {
        const file = newVariant.drawingFile;
        const filePath = `${formData.slug}/variants/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        drawingUrl = data.publicUrl;
      }

      // Calcula a próxima posição
      const maxPosition = variants.length > 0 ? Math.max(...variants.map(v => v.position || 0)) : 0;
      
      const { error } = await supabase
        .from('variants')
        .insert({
          product_id: editingProduct.id,
          type: newVariant.type,
          size: newVariant.size,
          drawing_url: drawingUrl,
          position: maxPosition + 1
        });
      if (error) throw error;
      toast({ title: 'Variante adicionada com sucesso!' });
      setNewVariant({ type: '', size: '', drawingFile: null });
      await loadVariants(editingProduct.id);
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar variante', description: error.message, variant: 'destructive' });
    } finally {
      setVariantSubmitting(false);
    }
  };

  const handleReorderVariants = async (reorderedVariants: any[]) => {
    try {
      // Atualiza as posições no banco
      const updates = reorderedVariants.map((variant, index) => 
        supabase
          .from('variants')
          .update({ position: index + 1 })
          .eq('id', variant.id)
      );
      
      await Promise.all(updates);
      setVariants(reorderedVariants);
      toast({ title: 'Ordem das variantes atualizada!' });
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar variantes', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('variants')
        .delete()
        .eq('id', variantId);
      if (error) throw error;
      toast({ title: 'Variante removida!' });
      if (editingProduct) await loadVariants(editingProduct.id);
    } catch (error: any) {
      toast({ title: 'Erro ao remover variante', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      category_id: product.category_id,
      images: product.images ? product.images.join(', ') : '',
      pdfs: product.pdfs ? product.pdfs.join(', ') : ''
    });
    setImageFiles(null);
    setPdfFiles(null);
    setNewVariant({ type: '', size: '', drawingFile: null });
    loadVariants(product.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Produto excluído com sucesso!' });
      refetch();
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleExportCSV = () => {
    // Criar CSV com dados dos produtos
    let csvContent = "ID,Título,Descrição,Categoria,Slug\n";
    
    products.forEach(product => {
      csvContent += `${product.id},${product.title},${product.description || ''},${product.category?.name || ''},${product.slug}\n`;
    });
    
    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'produtos_exportados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Produtos - Admin | Nexus Válvulas</title>
        <meta name="description" content="Gerenciamento de produtos" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <div className="flex space-x-2">
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setFormData({ title: '', slug: '', description: '', category_id: '', images: '', pdfs: '' });
                  setImageFiles(null);
                  setPdfFiles(null);
                  setVariants([]);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="images">Imagens (URLs separadas por vírgula)</Label>
                    <Textarea
                      id="images"
                      value={formData.images}
                      onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                      placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                    />
                    <div className="mt-2">
                      <Label htmlFor="imageFiles">ou envie imagens (múltiplas)</Label>
                      <Input id="imageFiles" type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pdfs">PDFs (URLs separadas por vírgula)</Label>
                    <Textarea
                      id="pdfs"
                      value={formData.pdfs}
                      onChange={(e) => setFormData(prev => ({ ...prev, pdfs: e.target.value }))}
                      placeholder="https://exemplo.com/manual1.pdf, https://exemplo.com/manual2.pdf"
                    />
                    <div className="mt-2">
                      <Label htmlFor="pdfFiles">ou envie PDFs (múltiplos)</Label>
                      <Input id="pdfFiles" type="file" accept="application/pdf" multiple onChange={(e) => setPdfFiles(e.target.files)} />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {editingProduct ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>

                  {editingProduct ? (
                    <div className="pt-6 border-t mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Variantes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="variantType">Tipo</Label>
                          <Input id="variantType" value={newVariant.type} onChange={(e) => setNewVariant(prev => ({ ...prev, type: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="variantSize">Tamanho</Label>
                          <Input id="variantSize" value={newVariant.size} onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="variantDrawing">Desenho (imagem)</Label>
                          <Input id="variantDrawing" type="file" accept="image/*" onChange={(e) => setNewVariant(prev => ({ ...prev, drawingFile: e.target.files?.[0] || null }))} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" onClick={handleAddVariant} disabled={variantSubmitting}>
                          Adicionar Variante
                        </Button>
                      </div>

                      <div>
                        <h4 className="text-md font-medium mb-3">Variantes Cadastradas</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Arraste e solte para reordenar as variantes
                        </p>
                      
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-8"></TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Tamanho</TableHead>
                              <TableHead>Desenho</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <DraggableVariantList
                              variants={variants}
                              onReorder={handleReorderVariants}
                              onDelete={handleDeleteVariant}
                            />
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 border-t mt-6 text-sm text-muted-foreground">
                      Para adicionar variantes, crie o produto primeiro e depois edite-o.
                    </div>
                  )}
                </form>
              </DialogContent>
            </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>{product.slug}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}