const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/auth');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@nexus.com';
    const password = 'admin123'; // troque por uma senha forte em produção
    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN' // String em vez de enum
      }
    });

    console.log('Admin criado com sucesso:', admin);
  } catch (err) {
    console.error('Erro ao criar admin:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
