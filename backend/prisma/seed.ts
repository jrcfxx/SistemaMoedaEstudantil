import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Instituições pré-cadastradas
  const instituicoes = [
    { nome: 'PUC Minas' },
    { nome: 'UFMG — Universidade Federal de Minas Gerais' },
    { nome: 'CEFET-MG' },
    { nome: 'UEMG — Universidade do Estado de Minas Gerais' },
  ]

  for (const inst of instituicoes) {
    await prisma.instituicao.upsert({
      where: { nome: inst.nome },
      update: {},
      create: inst,
    })
  }

  console.log(`✅ ${instituicoes.length} instituições cadastradas.`)
  console.log('✅ Seed concluído.')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
