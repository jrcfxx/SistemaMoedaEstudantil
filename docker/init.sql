-- =============================================================
--  Sistema de Moeda Estudantil — Script de Inicialização
--  Executado automaticamente pelo PostgreSQL na primeira vez
--  que o container é criado.
--
--  ATENÇÃO: Este script apenas garante que o banco existe e
--  habilita extensões necessárias. As tabelas são criadas e
--  gerenciadas pelo Prisma via migrations (Sprint 02+).
-- =============================================================

-- Habilita a extensão para geração de UUIDs (usada pelo Prisma)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Habilita a extensão citext (comparação de texto case-insensitive,
-- útil para campos de e-mail)
CREATE EXTENSION IF NOT EXISTS "citext";

-- Confirma inicialização
DO $$
BEGIN
  RAISE NOTICE 'Banco moeda_estudantil inicializado com sucesso.';
END
$$;
