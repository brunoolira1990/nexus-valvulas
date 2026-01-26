import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

// API_BASE deve incluir /api se não estiver incluído
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      // DRF pode retornar paginado {results: [...]} ou array direto
      const categoriesArray = Array.isArray(data) ? data : (data.results || []);
      setCategories(categoriesArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []);
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validação: imagem obrigatória ao criar
      if (!editingCategory && !imageFile) {
        toast({ 
          title: 'Erro', 
          description: 'É obrigatório enviar uma imagem ao criar categoria.', 
          variant: 'destructive' 
        });
        return;
      }

      // Validate slug uniqueness by querying backend
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const all = await res.json();
        const categoriesArray = Array.isArray(all) ? all : (all.results || []);
        const exists = categoriesArray.find((c: any) => c.slug === formData.slug && c.id !== editingCategory?.id);
        if (exists) {
          toast({ title: 'Erro', description: 'Slug já existe. Use outro slug.', variant: 'destructive' });
          return;
        }
      } catch (err: any) {
        toast({ title: 'Erro', description: 'Erro ao validar slug', variant: 'destructive' });
        return;
      }

      // First create or update category (without image reference)
      let categoryId = editingCategory?.id;
      if (editingCategory) {
        // Django usa ID como lookup_field para categorias
        const res = await fetch(`${API_BASE}/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
          },
          body: JSON.stringify({ name: formData.name, slug: formData.slug, description: formData.description })
        });
        if (!res.ok) throw new Error('Erro ao atualizar categoria');
        toast({ title: 'Categoria atualizada com sucesso!' });
      } else {
        const res = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
          },
          body: JSON.stringify({ name: formData.name, slug: formData.slug, description: formData.description })
        });
        if (!res.ok) throw new Error('Erro ao criar categoria');
        const insertData = await res.json();
        categoryId = insertData.id;
        toast({ title: 'Categoria criada com sucesso!' });
      }

      // Upload da imagem (obrigatória ao criar, opcional ao editar)
      if (imageFile && categoryId) {
        const form = new FormData();
        form.append('image', imageFile);
        const res = await fetch(`${API_BASE}/categories/${categoryId}/image`, {
          method: 'POST',
          headers: {
            ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
          },
          body: form
        });
        if (!res.ok) throw new Error('Erro ao enviar imagem');
      }
      
      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '' });
      setImageFile(null);
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    });
    setImagePreview(category.image || null);
    setDialogOpen(true);
  };

  const handleImageChange = (file?: File | null) => {
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: '' }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    
    try {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
    }
  });
  if (!res.ok) throw new Error('Erro ao deletar categoria');
      toast({ title: 'Categoria excluída com sucesso!' });
      refetch();
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  return (
    <>
      <Helmet>
        <title>Categorias - Admin | Nexus Válvulas</title>
        <meta name="description" content="Gerenciamento de categorias de produtos" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCategory(null);
                          setFormData({ name: '', slug: '', description: '', image: '' });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">
                    Imagem {!editingCategory && <span className="text-destructive">*</span>}
                    {editingCategory && <span className="text-muted-foreground text-sm">(opcional - deixe em branco para manter a atual)</span>}
                  </Label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="mt-2"
                    required={!editingCategory}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="mt-2 h-24 object-contain" />
                  )}
                  {!imagePreview && editingCategory && editingCategory.image && (
                    <img src={editingCategory.image} alt="atual" className="mt-2 h-24 object-contain" />
                  )}
                  {!editingCategory && (
                    <p className="text-sm text-muted-foreground mt-1">
                      A imagem é obrigatória ao criar uma nova categoria.
                    </p>
                  )}
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
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {((category as any).image) ? (
                          <img src={(category as any).image} alt={category.name} className="h-12 object-contain" />
                        ) : (
                          <div className="h-12 w-20 bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
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