import { Router } from 'express';
import { alunoController } from '../controllers/alunoController';

export const alunoRoutes = Router();

alunoRoutes.get('/', alunoController.findAll);
alunoRoutes.get('/:id', alunoController.findById);
alunoRoutes.post('/', alunoController.create);
alunoRoutes.put('/:id', alunoController.update);
alunoRoutes.delete('/:id', alunoController.delete);
