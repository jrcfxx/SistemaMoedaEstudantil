import { Router } from 'express';
import { empresaParceiraController } from '../controllers/empresaParceiraController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const empresaParceiraRoutes = Router();

empresaParceiraRoutes.use(authMiddleware);

empresaParceiraRoutes.get('/', empresaParceiraController.findAll);
empresaParceiraRoutes.get('/:id', empresaParceiraController.findById);
empresaParceiraRoutes.post('/', requireRole('ADMIN', 'EMPRESA'), empresaParceiraController.create);
empresaParceiraRoutes.put('/:id', requireRole('ADMIN', 'EMPRESA'), empresaParceiraController.update);
empresaParceiraRoutes.delete('/:id', requireRole('ADMIN'), empresaParceiraController.delete);
