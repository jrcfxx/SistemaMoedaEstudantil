import { Router } from 'express';
import { instituicaoController } from '../controllers/instituicaoController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const instituicaoRoutes = Router();

// Listagem pública — necessária para cadastro de alunos
instituicaoRoutes.get('/', instituicaoController.findAll);
instituicaoRoutes.get('/:id', instituicaoController.findById);

instituicaoRoutes.use(authMiddleware);

instituicaoRoutes.post('/', requireRole('ADMIN'), instituicaoController.create);
instituicaoRoutes.put('/:id', requireRole('ADMIN'), instituicaoController.update);
instituicaoRoutes.delete('/:id', requireRole('ADMIN'), instituicaoController.delete);
