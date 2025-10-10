import { useState, useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  cover_image?: string;
  published: boolean;
  published_date: string;
  meta_description?: string;
  keywords?: string[];
  created_at: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    cover_image: '',
    published: false,
    meta_description: '',
    keywords: ''
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchPosts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE}/blog/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(data || []);
    } catch (error: any) {
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
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      const postData = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
      };

      const url = editingPost ? `${API_BASE}/blog/posts/${editingPost.id}` : `${API_BASE}/blog/posts`;
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      toast({ title: editingPost ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!' });
      
      setDialogOpen(false);
      setEditingPost(null);
      setFormData({ title: '', slug: '', content: '', summary: '', cover_image: '', published: false, meta_description: '', keywords: '' });
      setCoverImageFile(null);
      fetchPosts();
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      summary: post.summary || '',
      cover_image: post.cover_image || '',
      published: post.published,
      meta_description: post.meta_description || '',
      keywords: post.keywords ? post.keywords.join(', ') : ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE}/blog/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      toast({ title: 'Post excluído com sucesso!' });
      fetchPosts();
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

  const testAuth = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      console.log('Testing auth with token:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        toast({ title: 'Erro de autenticação', description: 'Token não encontrado. Faça login novamente.', variant: 'destructive' });
        return;
      }
      
      const response = await fetch(`${API_BASE}/blog/debug-auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth test response status:', response.status);
      const result = await response.text();
      console.log('Auth test result:', result);
      
      if (response.ok) {
        toast({ title: 'Autenticação OK!' });
      } else {
        toast({ title: 'Erro de autenticação', description: result, variant: 'destructive' });
      }
    } catch (error: any) {
      console.error('Auth test error:', error);
      toast({ title: 'Erro no teste de auth', description: error.message, variant: 'destructive' });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      console.log('Starting upload for file:', file.name, file.size);
      const formData = new FormData();
      formData.append('cover_image', file);
      
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      console.log('Uploading to:', `${API_BASE}/blog/upload-cover`);
      console.log('Token exists:', !!token);
      console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      const response = await fetch(`${API_BASE}/blog/upload-cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Token de autenticação inválido ou expirado. Faça login novamente.');
        }
        
        throw new Error(`Erro ao fazer upload: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Upload result:', result);
      setFormData(prev => ({ ...prev, cover_image: result.url }));
      toast({ title: 'Imagem enviada com sucesso!' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Erro ao fazer upload', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setUploadingImage(false);
    }
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
          <div className="flex gap-2">
            <Button onClick={testAuth} variant="outline">
              Testar Auth
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingPost(null);
                  setFormData({ title: '', slug: '', content: '', summary: '', cover_image: '', published: false, meta_description: '', keywords: '' });
                  setCoverImageFile(null);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? 'Editar Post' : 'Novo Post'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  
                  <div>
                    <Label htmlFor="summary">Resumo</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cover_image">Imagem de Capa</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverImageFile(file);
                            handleImageUpload(file);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                      {formData.cover_image && (
                        <div className="mt-2">
                          <img 
                            src={formData.cover_image} 
                            alt="Preview" 
                            className="w-32 h-20 object-cover rounded border"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            URL: {formData.cover_image}
                          </p>
                        </div>
                      )}
                      <Input
                        id="cover_image"
                        value={formData.cover_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                        placeholder="Ou cole uma URL aqui"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Descrição</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      rows={2}
                      placeholder="Descrição para SEO (máx. 160 caracteres)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                    <Input
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="válvulas, industrial, automação"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                    />
                    <Label htmlFor="published">Publicado</Label>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(post.published_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {post.published && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
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
                            onClick={() => handleDelete(post.id)}
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