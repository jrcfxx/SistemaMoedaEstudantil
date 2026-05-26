import { Router } from 'express';
import { professorController } from '../controllers/professorController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const professorRoutes = Router();

professorRoutes.use(authMiddleware);

professorRoutes.get('/', professorController.findAll);
professorRoutes.get('/:id/transacoes', professorController.findTransacoes);
professorRoutes.get('/:id', professorController.findById);
professorRoutes.post('/', requireRole('ADMIN'), professorController.create);
professorRoutes.put('/:id', requireRole('ADMIN', 'PROFESSOR'), professorController.update);
professorRoutes.delete('/:id', requireRole('ADMIN'), professorController.delete);
professorRoutes.post('/:id/distribuir-moedas', requireRole('ADMIN', 'PROFESSOR'), professorController.distribuirMoedas);
