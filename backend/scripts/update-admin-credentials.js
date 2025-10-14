const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/auth');

const prisma = new PrismaClient();

async function updateAdminCredentials() {
  try {
    // Verificar se o usuário admin já existe
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (!existingAdmin) {
      console.log('Nenhum usuário admin encontrado. Criando novo usuário...');
      
      // Criar novo usuário admin com as credenciais especificadas
      const email = 'bruno.liraa@icloud.com';
      const password = 'Lira@Lira1990';
      const hashedPassword = await hashPassword(password);

      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Bruno Lira',
          role: 'ADMIN'
        }
      });

      console.log('Admin criado com sucesso:', admin);
    } else {
      console.log('Atualizando credenciais do usuário admin existente...');
      
      // Atualizar as credenciais do usuário admin existente
      const email = 'bruno.liraa@icloud.com';
      const password = 'Lira@Lira1990';
      const hashedPassword = await hashPassword(password);

      const updatedAdmin = await prisma.user.update({
        where: {
          id: existingAdmin.id
        },
        data: {
          email,
          password: hashedPassword,
          name: 'Bruno Lira'
        }
      });

      console.log('Credenciais do admin atualizadas com sucesso:', updatedAdmin);
    }
  } catch (err) {
    console.error('Erro ao atualizar/criar admin:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminCredentials();