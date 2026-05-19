import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { professorRoutes } from './routes/professorRoutes';
import { empresaParceiraRoutes } from './routes/empresaParceiraRoutes';
import { instituicaoRoutes } from './routes/instituicaoRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/empresas-parceiras', empresaParceiraRoutes);
app.use('/api/instituicoes', instituicaoRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
