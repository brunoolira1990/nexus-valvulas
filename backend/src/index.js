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

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
