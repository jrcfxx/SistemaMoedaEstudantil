import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SENHA = 'senha123';

async function main() {
  console.log('🌱 Iniciando seed...');

  // ───────────── Limpeza ─────────────
  await prisma.resgate.deleteMany();
  await prisma.transacaoMoeda.deleteMany();
  await prisma.vantagem.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.empresaParceira.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.instituicao.deleteMany();

  // ───────────── Instituições ─────────────
  const [puc, ufmg, ufop, cefet, newton] = await Promise.all([
    prisma.instituicao.create({ data: { nome: 'PUC Minas' } }),
    prisma.instituicao.create({ data: { nome: 'UFMG - Universidade Federal de Minas Gerais' } }),
    prisma.instituicao.create({ data: { nome: 'UFOP - Universidade Federal de Ouro Preto' } }),
    prisma.instituicao.create({ data: { nome: 'CEFET-MG' } }),
    prisma.instituicao.create({ data: { nome: 'Newton Paiva' } }),
  ]);
  console.log(`✅ 5 instituições criadas`);

  const senhaHash = await bcrypt.hash(SENHA, 10);

  // ───────────── Admin ─────────────
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@puc.br',
      senhaHash,
      tipo: 'ADMIN',
    },
  });
  console.log('✅ Admin criado: admin@puc.br');

  // ───────────── Professor ─────────────
  const usuarioProfessor = await prisma.usuario.create({
    data: {
      nome: 'Prof. Carlos Silva',
      email: 'professor@puc.br',
      senhaHash,
      tipo: 'PROFESSOR',
    },
  });
  await prisma.professor.create({
    data: {
      nome: 'Prof. Carlos Silva',
      cpf: '11122233344',
      departamento: 'Ciência da Computação',
      saldoMoedas: 1000,
      instituicaoId: puc.id,
      usuarioId: usuarioProfessor.id,
    },
  });
  console.log('✅ Professor criado: professor@puc.br');

  // ───────────── Aluno ─────────────
  const usuarioAluno = await prisma.usuario.create({
    data: {
      nome: 'João Aluno',
      email: 'aluno@puc.br',
      senhaHash,
      tipo: 'ALUNO',
    },
  });
  await prisma.aluno.create({
    data: {
      nome: 'João Aluno',
      email: 'aluno@puc.br',
      cpf: '55566677788',
      rg: '12345678',
      endereco: 'Rua das Flores, 100 - Belo Horizonte/MG',
      curso: 'Sistemas de Informação',
      saldoMoedas: 0,
      instituicaoId: puc.id,
      usuarioId: usuarioAluno.id,
    },
  });
  console.log('✅ Aluno criado: aluno@puc.br');

  // ───────────── Empresa Parceira ─────────────
  const usuarioEmpresa = await prisma.usuario.create({
    data: {
      nome: 'Tech Store BH',
      email: 'empresa@techstore.com',
      senhaHash,
      tipo: 'EMPRESA',
    },
  });
  const empresa = await prisma.empresaParceira.create({
    data: {
      nome: 'Tech Store BH',
      email: 'empresa@techstore.com',
      cnpj: '12345678000195',
      endereco: 'Av. Afonso Pena, 500 - Belo Horizonte/MG',
      telefone: '(31) 99999-0001',
      status: 'ATIVA',
      usuarioId: usuarioEmpresa.id,
    },
  });
  console.log('✅ Empresa criada: empresa@techstore.com');

  // ───────────── Vantagens de exemplo ─────────────
  await Promise.all([
    prisma.vantagem.create({
      data: {
        titulo: '10% de desconto em notebooks',
        descricao: 'Desconto exclusivo para alunos na compra de notebooks e acessórios na Tech Store BH.',
        fotoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
        custoMoedas: 100,
        empresaParceiraId: empresa.id,
      },
    }),
    prisma.vantagem.create({
      data: {
        titulo: 'Fone de ouvido Bluetooth',
        descricao: 'Troque suas moedas por um fone de ouvido bluetooth de alta qualidade com cancelamento de ruído.',
        fotoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        custoMoedas: 250,
        empresaParceiraId: empresa.id,
      },
    }),
    prisma.vantagem.create({
      data: {
        titulo: 'Mousepad Gamer',
        descricao: 'Mousepad gamer extra grande com superfície de alta precisão, ideal para jogos e trabalho.',
        fotoUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        custoMoedas: 80,
        empresaParceiraId: empresa.id,
      },
    }),
    prisma.vantagem.create({
      data: {
        titulo: 'Carregador Portátil 20.000mAh',
        descricao: 'Power bank de alta capacidade com carregamento rápido para manter seus dispositivos sempre ligados.',
        fotoUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
        custoMoedas: 150,
        empresaParceiraId: empresa.id,
      },
    }),
    prisma.vantagem.create({
      data: {
        titulo: 'Teclado Mecânico',
        descricao: 'Teclado mecânico compacto com switches blue, retroiluminação RGB e design slim.',
        fotoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        custoMoedas: 300,
        empresaParceiraId: empresa.id,
      },
    }),
    prisma.vantagem.create({
      data: {
        titulo: 'Webcam Full HD',
        descricao: 'Webcam 1080p com microfone integrado e correção automática de luz, perfeita para videoconferências.',
        fotoUrl: 'https://images.unsplash.com/photo-1623949557570-33e02c12f754?w=600&q=80',
        custoMoedas: 120,
        empresaParceiraId: empresa.id,
      },
    }),
  ]);
  console.log('✅ 6 vantagens criadas');

  // Instituições extras referenciadas mas não usadas acima (evitar warning)
  void ufmg; void ufop; void cefet; void newton;

  console.log('\n🎉 Seed concluído! Credenciais de acesso:');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│  TIPO       │ EMAIL                      │');
  console.log('├─────────────────────────────────────────┤');
  console.log('│  Admin      │ admin@puc.br               │');
  console.log('│  Professor  │ professor@puc.br           │');
  console.log('│  Aluno      │ aluno@puc.br               │');
  console.log('│  Empresa    │ empresa@techstore.com      │');
  console.log('├─────────────────────────────────────────┤');
  console.log('│  Senha (todos): senha123                │');
  console.log('└─────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
