const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/auth');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'bruno.liraa@icloud.com';
    const password = 'Lira@Lira1990'; // Senha segura para produção
    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Bruno Lira',
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