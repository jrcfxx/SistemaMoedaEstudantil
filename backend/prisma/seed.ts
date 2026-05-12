import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.instituicao.deleteMany();

  const instituicoes = await Promise.all([
    prisma.instituicao.create({ data: { nome: 'PUC Minas' } }),
    prisma.instituicao.create({ data: { nome: 'UFMG - Universidade Federal de Minas Gerais' } }),
    prisma.instituicao.create({ data: { nome: 'UFOP - Universidade Federal de Ouro Preto' } }),
    prisma.instituicao.create({ data: { nome: 'CEFET-MG' } }),
    prisma.instituicao.create({ data: { nome: 'Newton Paiva' } }),
  ]);

  console.log(`✅ ${instituicoes.length} instituições criadas`);
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
