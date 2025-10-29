const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ensureDir, removeFileIfExists } = require('./utils');
const { hashPassword, comparePasswords, generateToken, authMiddleware } = require('./auth');
const { sendContactEmail, sendConfirmationEmail } = require('./email');

const app = express();

// Configuração específica de CORS para permitir apenas o domínio do frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4000']
    : process.env.PUBLIC_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '..', '..', 'dist');
  
  // Verificar se o diretório dist existe
  if (fs.existsSync(frontendDistPath)) {
    console.log('Servindo frontend a partir de:', frontendDistPath);
    
    // Servir arquivos estáticos com cache
    app.use(express.static(frontendDistPath, {
      maxAge: '1y',
      etag: false,
      setHeaders: function (res, path) {
        // Adicionar cabeçalhos de segurança
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        
        // Configurar corretamente o tipo MIME para JavaScript
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        
        // Configurar corretamente o tipo MIME para JSON
        if (path.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json');
        }
      }
    }));
    
    // Rota catch-all para SPA (React Router)
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    console.warn('Diretório dist não encontrado. O frontend não será servido.');
    // Endpoint de health check mesmo sem frontend
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Backend API Nexus Válvulas está funcionando!', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    });
  }
}

// Auth endpoints
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const token = generateToken(user);
    res.json({ user: { id: user.id, email, name, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Check password
    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = generateToken(user);
    res.json({ 
      user: { id: user.id, email, name: user.name, role: user.role },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    console.log('=== NOVA REQUISIÇÃO DE CONTATO ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    const { nome, empresa, email, telefone, assunto, mensagem } = req.body;
    
    // Validação básica
    if (!nome || !email || !assunto || !mensagem) {
      console.log('Campos obrigatórios ausentes');
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome, email, assunto e mensagem' 
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email inválido:', email);
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    const contactData = {
      nome,
      empresa: empresa || '',
      email,
      telefone: telefone || '',
      assunto,
      mensagem
    };

    console.log('Dados do contato preparados:', contactData);

    // Salvar no banco de dados (opcional)
    try {
      await prisma.contactMessage.create({
        data: contactData
      });
      console.log('Mensagem salva no banco de dados');
    } catch (dbError) {
      console.log('Erro ao salvar no banco (não crítico):', dbError.message);
      console.log('Continuando sem salvar no banco...');
      // Continuar mesmo se não conseguir salvar no banco
    }

    // Enviar emails
    console.log('Enviando emails...');
    const emailResult = await sendContactEmail(contactData);
    console.log('Resultado do email principal:', emailResult);
    
    const confirmationResult = await sendConfirmationEmail(contactData);
    console.log('Resultado do email de confirmação:', confirmationResult);

    if (emailResult.success) {
      console.log('Emails enviados com sucesso');
      res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso!',
        confirmationSent: confirmationResult.success
      });
    } else {
      console.log('Erro ao enviar emails:', emailResult.error);
      res.status(500).json({ 
        error: 'Erro ao enviar mensagem. Tente novamente mais tarde.',
        details: emailResult.error
      });
    }
  } catch (err) {
    console.error('Erro no endpoint de contato:', err);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: err.message 
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Simple contact test endpoint
app.post('/contact-test', (req, res) => {
  console.log('Recebida requisição de teste:', req.body);
  res.json({ 
    success: true, 
    message: 'Endpoint de teste funcionando!',
    receivedData: req.body
  });
});

// Test email endpoint
app.post('/test-email', async (req, res) => {
  try {
    const { sendContactEmail } = require('./email');
    const testData = {
      nome: 'Teste',
      email: 'teste@exemplo.com',
      assunto: 'Teste de Email',
      mensagem: 'Esta é uma mensagem de teste'
    };
    
    const result = await sendContactEmail(testData);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ensure upload dir exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'categories');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// uploads for products and variants
const productUploadDir = path.join(__dirname, '..', 'uploads', 'products');
const variantUploadDir = path.join(__dirname, '..', 'uploads', 'variants');
const blogUploadDir = path.join(__dirname, '..', 'uploads', 'blog');
fs.mkdirSync(productUploadDir, { recursive: true });
fs.mkdirSync(variantUploadDir, { recursive: true });
fs.mkdirSync(blogUploadDir, { recursive: true });
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, productUploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const productUpload = multer({ storage: productStorage });
const variantStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, variantUploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const variantUpload = multer({ storage: variantStorage });

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogUploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const blogUpload = multer({ storage: blogStorage });

// GET /categories
app.get('/categories', async (req, res) => {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { images: { orderBy: { position: 'asc' }, take: 1 } }
    });
    const normalized = cats.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.images && c.images[0] ? `${PUBLIC_URL}/uploads/categories/${path.basename(c.images[0].url)}` : null
    }));
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// POST /categories
app.post('/categories', authMiddleware('admin'), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const cat = await prisma.category.create({ data: { name, slug, description } });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar categoria', details: err.message });
  }
});

// PUT /categories/:id
app.put('/categories/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;
    const cat = await prisma.category.update({ where: { id }, data: { name, slug, description } });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar categoria', details: err.message });
  }
});

// POST /categories/:id/image
app.post('/categories/:id/image', authMiddleware('admin'), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    // remove existing images for this category (file on disk + DB record)
    const existingImages = await prisma.categoryImage.findMany({ where: { categoryId: id } });
    for (const img of existingImages) {
      try {
        const filename = img.url ? require('path').basename(img.url) : null;
        if (filename) {
          const filePath = path.join(__dirname, '..', 'uploads', 'categories', filename);
          removeFileIfExists(filePath);
        }
      } catch (e) {
        console.error('Error removing old image file:', e);
      }
      try {
        await prisma.categoryImage.delete({ where: { id: img.id } });
      } catch (e) {
        console.error('Error deleting old image record:', e);
      }
    }

    const fileUrl = `${PUBLIC_URL}/uploads/categories/${req.file.filename}`;
    const img = await prisma.categoryImage.create({ data: { categoryId: id, url: fileUrl, position: 0 } });
    res.json(img);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: err.message });
  }
});

// DELETE /categories/:id
app.delete('/categories/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const { category: categorySlug } = req.query;

    let where = {};
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: String(categorySlug) } });
      if (!category) return res.json([]);
      where = { categoryId: category.id };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { title: 'asc' },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        pdfs: { orderBy: { position: 'asc' } },
      },
    });

    const normalized = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      category_id: p.categoryId,
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
      images: (p.images || []).map((img) => ({ url: img.url, position: img.position })),
      pdfs: (p.pdfs || []).map((pdf) => ({ url: pdf.url, position: pdf.position })),
    }));

    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /products/:slug
app.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        pdfs: { orderBy: { position: 'asc' } },
      },
    });

    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    const variants = await prisma.variant.findMany({
      where: { productId: product.id },
      orderBy: [ { position: 'asc' }, { type: 'asc' }, { size: 'asc' } ],
    });

    const normalizedProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      category_id: product.categoryId,
      category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
      images: (product.images || []).map((img) => ({ url: img.url, position: img.position })),
      pdfs: (product.pdfs || []).map((pdf) => ({ url: pdf.url, position: pdf.position })),
    };

    const normalizedVariants = variants.map((v) => ({
      id: v.id,
      product_id: v.productId,
      type: v.type,
      size: v.size,
      specifications: v.specifications,
      drawing_url: v.drawingUrl || null,
      position: v.position,
    }));

    res.json({ product: normalizedProduct, variants: normalizedVariants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST /products
app.post('/products', authMiddleware('admin'), async (req, res) => {
  try {
    const { title, slug, description, category_id, images = [], pdfs = [] } = req.body;
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        categoryId: category_id,
        images: { create: (images || []).map((url, idx) => ({ url, position: idx + 1 })) },
        pdfs: { create: (pdfs || []).map((url, idx) => ({ url, position: idx + 1 })) },
      },
      include: { images: true, pdfs: true }
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto', details: err.message });
  }
});

// PUT /products/:id
app.put('/products/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, category_id, images, pdfs } = req.body;

    const data = { title, slug, description, categoryId: category_id };
    // Remove undefined to avoid overwriting unintentionally
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.product.update({ where: { id }, data });
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await Promise.all(images.map((url, idx) => tx.productImage.create({ data: { productId: id, url, position: idx + 1 } })));
      }
      if (Array.isArray(pdfs)) {
        await tx.productPdf.deleteMany({ where: { productId: id } });
        await Promise.all(pdfs.map((url, idx) => tx.productPdf.create({ data: { productId: id, url, position: idx + 1 } })));
      }
      return tx.product.findUnique({
        where: { id },
        include: { images: { orderBy: { position: 'asc' } }, pdfs: { orderBy: { position: 'asc' } } }
      });
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: err.message });
  }
});

// DELETE /products/:id
app.delete('/products/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// POST /products/:id/images (multipart)
app.post('/products/:id/images', authMiddleware('admin'), productUpload.array('images', 20), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const created = await Promise.all(req.files.map((f, idx) =>
      prisma.productImage.create({ data: { productId: id, url: `${PUBLIC_URL}/uploads/products/${f.filename}`, position: idx + 1 } })
    ));
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar imagens' });
  }
});

// POST /products/:id/pdfs (multipart)
app.post('/products/:id/pdfs', authMiddleware('admin'), productUpload.array('pdfs', 20), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const created = await Promise.all(req.files.map((f, idx) =>
      prisma.productPdf.create({ data: { productId: id, url: `${PUBLIC_URL}/uploads/products/${f.filename}`, position: idx + 1 } })
    ));
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar PDFs' });
  }
});

// GET /products/:id/variants
app.get('/products/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;
    const variants = await prisma.variant.findMany({ where: { productId: id }, orderBy: [{ position: 'asc' }, { type: 'asc' }, { size: 'asc' }] });
    res.json(variants.map(v => ({ id: v.id, product_id: v.productId, type: v.type, size: v.size, specifications: v.specifications, drawing_url: v.drawingUrl || null, position: v.position })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar variantes' });
  }
});

// POST /products/:id/variants
app.post('/products/:id/variants', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { type, size, drawing_url } = req.body;
    const max = await prisma.variant.aggregate({ _max: { position: true }, where: { productId: id } });
    const nextPos = (max._max.position || 0) + 1;
    const v = await prisma.variant.create({ data: { productId: id, type, size, drawingUrl: drawing_url || null, position: nextPos } });
    res.json({ id: v.id, product_id: v.productId, type: v.type, size: v.size, drawing_url: v.drawingUrl, position: v.position });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar variante' });
  }
});

// POST /variants/:id/drawing (multipart)
app.post('/variants/:id/drawing', authMiddleware('admin'), variantUpload.single('drawing'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const url = `${PUBLIC_URL}/uploads/variants/${req.file.filename}`;
    const v = await prisma.variant.update({ where: { id }, data: { drawingUrl: url } });
    res.json({ id: v.id, drawing_url: v.drawingUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar desenho' });
  }
});

// PUT /variants/reorder
app.put('/variants/reorder', authMiddleware('admin'), async (req, res) => {
  try {
    const { items } = req.body; // [{id, position}]
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Formato inválido' });
    await Promise.all(items.map(it => prisma.variant.update({ where: { id: it.id }, data: { position: it.position } })));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao reordenar variantes' });
  }
});

// DELETE /variants/:id
app.delete('/variants/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.variant.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar variante' });
  }
});

// Blog endpoints
// POST /blog/upload-cover
app.post('/blog/upload-cover', authMiddleware('admin'), blogUpload.single('cover_image'), async (req, res) => {
  try {
    console.log('Upload request received:', { file: req.file, body: req.body });
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const fileUrl = `${PUBLIC_URL}/uploads/blog/${req.file.filename}`;
    console.log('File uploaded successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: err.message });
  }
});

// Test endpoint without auth
app.post('/blog/upload-test', blogUpload.single('cover_image'), async (req, res) => {
  try {
    console.log('Test upload request received:', { file: req.file, body: req.body });
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const fileUrl = `${PUBLIC_URL}/uploads/blog/${req.file.filename}`;
    console.log('Test file uploaded successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Test upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: err.message });
  }
});

// Debug auth endpoint
app.post('/blog/debug-auth', authMiddleware('admin'), (req, res) => {
  console.log('Auth debug - user:', req.user);
  res.json({ success: true, user: req.user });
});

// Blog CRUD endpoints
// GET /blog/posts
app.get('/blog/posts', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar posts do blog' });
  }
});

// POST /blog/posts
app.post('/blog/posts', authMiddleware('admin'), async (req, res) => {
  try {
    const { title, slug, content, summary, cover_image, published, meta_description, keywords } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Título, slug e conteúdo são obrigatórios' });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        summary,
        cover_image,
        published: published || false,
        published_date: published ? new Date() : null,
        meta_description,
        keywords: keywords || []
      }
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Slug já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao criar post' });
    }
  }
});

// PUT /blog/posts/:id
app.put('/blog/posts/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, summary, cover_image, published, meta_description, keywords } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Título, slug e conteúdo são obrigatórios' });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        summary,
        cover_image,
        published: published || false,
        published_date: published ? new Date() : null,
        meta_description,
        keywords: keywords || []
      }
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Slug já existe' });
    } else if (err.code === 'P2025') {
      res.status(404).json({ error: 'Post não encontrado' });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar post' });
    }
  }
});

// DELETE /blog/posts/:id
app.delete('/blog/posts/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Post não encontrado' });
    } else {
      res.status(500).json({ error: 'Erro ao deletar post' });
    }
  }
});

// POST /quotes (pedido de cotação)
app.post('/quotes', async (req, res) => {
  try {
    const { productId, variantType, variantSize, name, email, phone, message } = req.body;
    if (!productId || !name || !email) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    const quote = await prisma.quote.create({
      data: { productId, variantType, variantSize, name, email, phone, message }
    });
    res.json({ success: true, id: quote.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar cotação' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  
  // Informar se está servindo o frontend também
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '..', '..', 'dist'))) {
    console.log(`✅ Frontend também está sendo servido a partir desta instância`);
    console.log(`🌍 Acesse: http://localhost:${PORT}`);
  }
});