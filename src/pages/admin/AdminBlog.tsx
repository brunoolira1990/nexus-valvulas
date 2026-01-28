import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOEditor } from '@/components/admin/SEOEditor';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  cover_image_url?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  is_published: boolean;
  published?: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'Noticias', label: 'Notícias' },
  { value: 'Tecnico', label: 'Técnico' },
  { value: 'Eventos', label: 'Eventos' },
  { value: 'Produtos', label: 'Produtos' },
];

export default function AdminBlog() {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Noticias',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    is_published: false,
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const handleAuthError = () => {
    toast({
      title: 'Sessão expirada',
      description: 'Por favor, faça login novamente.',
      variant: 'destructive',
    });
    signOut();
    navigate('/login');
  };

  const fetchPosts = async () => {
    try {
      if (!token) {
        handleAuthError();
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
      
      const response = await fetch(`${API_BASE}/blog/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        handleAuthError();
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const postsArray = Array.isArray(data) ? data : (data.results || []);
      setPosts(postsArray);
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('token')) {
        handleAuthError();
        return;
      }
      toast({ 
        title: 'Erro ao carregar posts', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!token) {
        handleAuthError();
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('meta_title', formData.meta_title);
      formDataToSend.append('meta_description', formData.meta_description);
      formDataToSend.append('focus_keyword', formData.focus_keyword);
      formDataToSend.append('is_published', formData.is_published.toString());
      
      if (coverImageFile) {
        formDataToSend.append('cover_image', coverImageFile);
      }

      const url = editingPost 
        ? `${API_BASE}/blog/posts/${editingPost.slug}/` 
        : `${API_BASE}/blog/posts/`;
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      toast({ 
        title: editingPost ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!' 
      });
      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('token')) {
        handleAuthError();
        return;
      }
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: 'Noticias',
      meta_title: '',
      meta_description: '',
      focus_keyword: '',
      is_published: false,
    });
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const handleEdit = async (post: BlogPost) => {
    try {
      if (!token) {
        handleAuthError();
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

      const response = await fetch(`${API_BASE}/blog/posts/${post.slug}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const fullPost: BlogPost = await response.json();
      setEditingPost(fullPost);
      setFormData({
        title: fullPost.title,
        slug: fullPost.slug,
        content: fullPost.content,
        excerpt: fullPost.excerpt || '',
        category: fullPost.category || 'Noticias',
        meta_title: fullPost.meta_title || '',
        meta_description: fullPost.meta_description || '',
        focus_keyword: fullPost.focus_keyword || '',
        is_published: !!(fullPost.is_published ?? fullPost.published),
      });
      setCoverImageFile(null);
      setCoverImagePreview(fullPost.cover_image_url || fullPost.cover_image || null);
      setDialogOpen(true);
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('token')) {
        handleAuthError();
        return;
      }
      toast({
        title: 'Erro ao carregar post',
        description: error.message,
        type: 'foreground',
      });
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      if (!token) {
        handleAuthError();
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
      
      const response = await fetch(`${API_BASE}/blog/posts/${post.slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      toast({ title: 'Post excluído com sucesso!' });
      fetchPosts();
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('token')) {
        handleAuthError();
        return;
      }
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

  return (
    <>
      <Helmet>
        <title>Blog - Admin | Nexus Válvulas</title>
        <meta name="description" content="Gerenciamento de posts do blog" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <Dialog 
            open={dialogOpen} 
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Editar Post' : 'Novo Post'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações Básicas</h3>
                  
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={2}
                      placeholder="Resumo curto do post (até 500 caracteres)"
                      maxLength={500}
                    />
                  </div>
                </div>

                {/* Editor de Conteúdo */}
                <div className="space-y-2">
                  <Label>Conteúdo *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  />
                </div>

                {/* Upload de Imagem */}
                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <ImageUpload
                    value={coverImageFile}
                    previewUrl={coverImagePreview}
                    onChange={(file) => {
                      setCoverImageFile(file);
                      if (!file) {
                        setCoverImagePreview(null);
                      }
                    }}
                  />
                </div>

                {/* SEO Section */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="seo">
                    <AccordionTrigger>Otimização para Buscadores (SEO)</AccordionTrigger>
                    <AccordionContent>
                      <SEOEditor
                        metaTitle={formData.meta_title}
                        metaDescription={formData.meta_description}
                        focusKeyword={formData.focus_keyword}
                        onMetaTitleChange={(value) => setFormData(prev => ({ ...prev, meta_title: value }))}
                        onMetaDescriptionChange={(value) => setFormData(prev => ({ ...prev, meta_description: value }))}
                        onFocusKeywordChange={(value) => setFormData(prev => ({ ...prev, focus_keyword: value }))}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Publicação */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="is_published">Publicar imediatamente</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingPost ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Posts do Blog</CardTitle>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum post cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {CATEGORIES.find(c => c.value === post.category)?.label || post.category || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={(post.is_published || post.published) ? "default" : "secondary"}>
                            {(post.is_published || post.published) ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {(post.is_published || post.published) && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(post)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
