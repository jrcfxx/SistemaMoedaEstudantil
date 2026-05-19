import { Router } from 'express';
import { instituicaoController } from '../controllers/instituicaoController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const instituicaoRoutes = Router();

instituicaoRoutes.use(authMiddleware);

instituicaoRoutes.get('/', instituicaoController.findAll);
instituicaoRoutes.get('/:id', instituicaoController.findById);
instituicaoRoutes.post('/', requireRole('ADMIN'), instituicaoController.create);
instituicaoRoutes.put('/:id', requireRole('ADMIN'), instituicaoController.update);
instituicaoRoutes.delete('/:id', requireRole('ADMIN'), instituicaoController.delete);
