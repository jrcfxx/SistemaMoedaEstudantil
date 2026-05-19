import { Router } from 'express';
import { alunoController } from '../controllers/alunoController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const alunoRoutes = Router();

alunoRoutes.use(authMiddleware);

alunoRoutes.get('/', alunoController.findAll);
alunoRoutes.get('/:id/transacoes', alunoController.findTransacoes);
alunoRoutes.get('/:id', alunoController.findById);
alunoRoutes.post('/', requireRole('ADMIN', 'PROFESSOR'), alunoController.create);
alunoRoutes.put('/:id', requireRole('ADMIN', 'PROFESSOR'), alunoController.update);
alunoRoutes.delete('/:id', requireRole('ADMIN'), alunoController.delete);
