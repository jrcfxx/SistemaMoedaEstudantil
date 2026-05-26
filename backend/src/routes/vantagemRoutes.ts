import { Router } from 'express';
import { vantagemController } from '../controllers/vantagemController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const vantagemRoutes = Router();

vantagemRoutes.use(authMiddleware);

// Rotas estáticas SEMPRE antes de /:id para evitar conflito de roteamento
vantagemRoutes.post('/resgatar', requireRole('ALUNO'), vantagemController.resgatar);
vantagemRoutes.get('/resgates/aluno/:id', requireRole('ADMIN', 'ALUNO'), vantagemController.findResgatesByAluno);
vantagemRoutes.get('/empresa/:empresaParceiraId', vantagemController.findByEmpresa);

vantagemRoutes.get('/', vantagemController.findAll);
vantagemRoutes.get('/:id', vantagemController.findById);
vantagemRoutes.post('/', requireRole('ADMIN', 'EMPRESA'), vantagemController.create);
vantagemRoutes.put('/:id', requireRole('ADMIN', 'EMPRESA'), vantagemController.update);
vantagemRoutes.delete('/:id', requireRole('ADMIN', 'EMPRESA'), vantagemController.delete);
